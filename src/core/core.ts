
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

export function pointIsWithinAngle(basePoint: Vector2, target: Vector2, lowerAngle: number, upperAngle: number): boolean {
    const angle = angleBetween(basePoint, target);

    lowerAngle = normalizeRadians(lowerAngle);
    upperAngle = normalizeRadians(upperAngle);

    console.log(`Angle = ${angle} lower = ${lowerAngle}, upper = ${upperAngle}`)
    return (angle > lowerAngle) && (angle < upperAngle);
}

export function normalizeRadians(radians: number): number {
    return radians - (TWO_PI * Math.floor(radians / TWO_PI));
}








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