
module basicgeom {

    export function lowerPrecission(x:number):number {
        return Math.round(x * 100.) / 100.;
    }


    export interface XYPair {
        x: number;
        y: number;
    }

    export class Point2D implements XYPair {
        constructor(public x:number, public y:number) {
        }

        public asCssTranslation(unit?:string):string {
            unit = unit || "px";
            return "translate( " + String(lowerPrecission(this.x)) + unit +
                ", " + String(lowerPrecission(this.y)) + unit + ")";
        }

        public distanceTo(other:XYPair):number {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        public distanceToOrigin():number {
            var dx = this.x;
            var dy = this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    export class Matrix2D {
        public coord_array:Array<number>;

        constructor() {
            this.coord_array = [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ];
        }

        public clone():Matrix2D {
            var result = new Matrix2D();
            result.coord_array = this.coord_array.slice(0);
            return result;
        }

        public toTransform():Matrix2D {
            var result = this.clone();
            result.coord_array[6] = 0
            result.coord_array[7] = 0;
            return result;
        }
    }

    export class CirclePositioner {
        private delta:number;

        constructor(public use_radius:number, public piece_count:number) {
            this.delta = Math.PI * 2 / piece_count;
        }

        public at(i:number):Point2D {
            var angle = i * this.delta;
            return new Point2D(
                    Math.cos(angle) * this.use_radius,
                    Math.sin(angle) * this.use_radius
            );
        }

        public angleAt(i:number):number {
            return i * this.delta;
        }

        public degreeAngleAt(i:number):number {
            return i / (Math.PI * 2) * 360.;
        }
    }
    ;

    export function sanitizeAngle(angle:number):number {
        if (angle < 0) {
            angle = angle + Math.PI * 2;
        } else if (angle > Math.PI * 2) {
            var integer_part = Math.floor(angle / Math.PI / 2.);
            angle = angle - integer_part * Math.PI * 2;
        }
        return angle;
    }

}