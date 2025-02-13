/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/ir-engine/ir-engine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Infinite Reality Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Infinite Reality Engine team.

All portions of the code written by the Infinite Reality Engine team are Copyright © 2021-2023 
Infinite Reality Engine. All Rights Reserved.
*/


export const PRIVATE = Symbol('@@webxr-polyfill/XRRay');

import { mat4, vec3, vec4 } from 'gl-matrix';

import XRRigidTransform from 'webxr-polyfill/src/api/XRRigidTransform';

export default class XRRay {
	constructor(origin, direction) {
		const _origin = { x: 0, y: 0, z: 0, w: 1 };
		const _direction = { x: 0, y: 0, z: -1, w: 0 };

		if (origin && origin instanceof XRRigidTransform) {
			const transform = origin;
			const matrix = transform.matrix;
			const originVec4 = vec4.set(
				vec4.create(),
				_origin.x,
				_origin.y,
				_origin.z,
				_origin.w,
			);
			const directionVec4 = vec4.set(
				vec4.create(),
				_direction.x,
				_direction.y,
				_direction.z,
				_direction.w,
			);
			vec4.transformMat4(originVec4, originVec4, matrix);
			vec4.transformMat4(directionVec4, directionVec4, matrix);
			_origin.x = originVec4[0];
			_origin.y = originVec4[1];
			_origin.z = originVec4[2];
			_origin.w = originVec4[3];
			_direction.x = directionVec4[0];
			_direction.y = directionVec4[1];
			_direction.z = directionVec4[2];
			_direction.w = directionVec4[3];
		} else {
			if (origin) {
				_origin.x = origin.x;
				_origin.y = origin.y;
				_origin.z = origin.z;
				_origin.w = origin.w;
			}
			if (direction) {
				_direction.x = direction.x;
				_direction.y = direction.y;
				_direction.z = direction.z;
				_direction.w = direction.w;
			}
		}

		// Normalize direction
		const length =
			Math.sqrt(
				_direction.x * _direction.x +
					_direction.y * _direction.y +
					_direction.z * _direction.z,
			) || 1;
		_direction.x = _direction.x / length;
		_direction.y = _direction.y / length;
		_direction.z = _direction.z / length;

		this[PRIVATE] = {
			origin: new DOMPointReadOnly(_origin.x, _origin.y, _origin.z, _origin.w),
			direction: new DOMPointReadOnly(
				_direction.x,
				_direction.y,
				_direction.z,
				_direction.w,
			),
			matrix: null,
		};
	}

	get origin() {
		return this[PRIVATE].origin;
	}

	get direction() {
		return this[PRIVATE].direction;
	}

	get matrix() {
		if (this[PRIVATE].matrix) {
			return this[PRIVATE].matrix;
		}
		// @TODO: Check if the calculation is correct
		const z = vec3.set(vec3.create(), 0, 0, -1);
		const origin = vec3.set(
			vec3.create(),
			this[PRIVATE].origin.x,
			this[PRIVATE].origin.y,
			this[PRIVATE].origin.z,
		);
		const direction = vec3.set(
			vec3.create(),
			this[PRIVATE].direction.x,
			this[PRIVATE].direction.y,
			this[PRIVATE].direction.z,
		);
		const axis = vec3.cross(vec3.create(), direction, z);
		const cosAngle = vec3.dot(direction, z);
		const rotation = mat4.create();
		if (cosAngle > -1 && cosAngle < 1) {
			mat4.fromRotation(rotation, Math.acos(cosAngle), axis);
		} else if (cosAngle === -1) {
			mat4.fromRotation(
				rotation,
				Math.acos(cosAngle),
				vec3.set(vec3.create(), 1, 0, 0),
			);
		}
		const translation = mat4.fromTranslation(mat4.create(), origin);
		const matrix = mat4.multiply(mat4.create(), translation, rotation);
		this[PRIVATE].matrix = matrix;
		return matrix;
	}
}
