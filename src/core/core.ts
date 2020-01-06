
// export class Vector2 {
//     constructor(readonly x: number, readonly y: number) {
//     }
// }

// TODO: just using Phaser Vector and Bezier Curves for now I guess :-(
type Vector2 = Phaser.Math.Vector2;

export const TWO_PI = 2 * Math.PI;

export const THIRTY_DEGREES = 30 * Math.PI / 180;

export function angleBetween(a: Vector2, b: Vector2): number {
    const result =  Math.atan2(b.y - a.y, b.x - a.x);
    return normalizeRadians(result);
}

export function distanceBetween(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function findPointAtDistance(basePoint: Vector2, angle: number, distance: number): Vector2 {
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return new Phaser.Math.Vector2(basePoint.x + x, basePoint.y + y);
}

// TODO: unit test this
// Assumes target is normalized
// only works for less than 180 degrees
export function isAngleBetween(target: number, angle1: number, angle2: number) {
    console.log(`Angle = ${target} lower = ${angle1}, upper = ${angle2}`)

    // swap the angles if necessary to get the difference less than 180 degrees
    const rAngle = normalizeRadians(angle2 - angle1);
    if (rAngle >= Math.PI) {
        let swap = angle1
        angle1 = angle2
        angle2 = swap
    }

    if (angle1 <= angle2) {
        return target >= angle1 && target <= angle2
    } else {
        return target >= angle1 || target <= angle2
    }
}

export function normalizeRadians(radians: number): number {
    return radians - (TWO_PI * Math.floor(radians / TWO_PI));
    // Or could use mod (but use it twice)
}


// https://github.com/davidfig/angle/blob/master/index.js





// Check out Barycentric coordinate system for maybe a more efficient check?
// Probably uneeded?
// https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
// TODO: understand this
export function pointInTriangle(point: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): boolean {
    const d1 = findSign(point, v1, v2);
    const d2 = findSign(point, v2, v3);
    const d3 = findSign(point, v3, v1);

    const hasNegative = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPositive = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNegative && hasPositive);
}
    
// TODO: understand this
function findSign(p1: Vector2, p2: Vector2, p3: Vector2): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}