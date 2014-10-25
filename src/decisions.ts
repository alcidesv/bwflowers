
/// <reference path='./basicgeom/basic.ts' />

module bwflowers {

    import bg=basicgeom;

    export class CompositionDecisions {
        public stemCount:number;
        public style: StyleDecisions;
        public stemDecisions: Array<StemDecisions>;
    }

    export class StyleDecisions {
        // Css color
        public color: string;
        public bgColor: string;
    }

    export class StemDecisions {
        public centerShift:bg.Point2D;
        public style: StyleDecisions;
        public rotateStart: number;
        public rotateEnd: number;
        public centerCircleRadius: number;
        public petalRadius: number;
        public petalCount: number;
        public petalTypeSequence: Array<number>;
    }

}