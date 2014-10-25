
/// <reference path='./decisions.ts' />
/// <reference path='./basicgeom/basic.ts'/>

module bwflowers {

    import bg = basicgeom;

    export interface IFragmentDraw {
        (ctx:CanvasRenderingContext2D): void ;
    }

    var petalDrawingLib : Array< IFragmentDraw > = [
        function (ctx:CanvasRenderingContext2D):void {
            ctx.beginPath();
            ctx.arc(0.0, 0.5, 0.5, 0.0, Math.PI*2);
            ctx.stroke();
        },
        function (ctx:CanvasRenderingContext2D):void {
            ctx.beginPath();
            ctx.arc(0.0, 0.5, 0.5, 0.0, Math.PI*2);
            ctx.fill();
        },
        function (ctx:CanvasRenderingContext2D): void {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-0.8, 0.8);
            ctx.lineTo(0.8, 0.8);
            ctx.closePath();
            ctx.stroke();
        },
        function (ctx:CanvasRenderingContext2D): void {
            ctx.save();
            ctx.scale(0.3, 1.5);
            ctx.arc(0.0, 0.5, 0.5, 0.0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        },
        function (ctx:CanvasRenderingContext2D): void {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-0.8, 0.8);
            ctx.lineTo(0.8, 0.8);
            ctx.closePath();
            ctx.fill();
        },
        function (ctx:CanvasRenderingContext2D): void {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-0.5, 0.5);
            ctx.lineTo(0.0, 1.0);
            ctx.lineTo(0.5, 0.5);
            ctx.closePath();
            ctx.stroke();
        }
    ];

    export function draw(ctx:CanvasRenderingContext2D, decisions:CompositionDecisions): void
    {
        ctx.fillStyle = decisions.style.bgColor;
        ctx.rect(0, 0, 1, 1);
        ctx.fill();
        ctx.lineWidth = 1.0/40.;
        ctx.strokeStyle = decisions.style.color;
        for (var i=0; i < decisions.stemCount; i++)
        {
            drawStem(ctx, decisions.stemDecisions[i]);
        }
    }


    export function drawStem(ctx:CanvasRenderingContext2D, decisions:StemDecisions): void {
        // Round 1: let's just draw a line...

        ctx.beginPath();

        var base = new bg.Point2D(0.5, 1.0);

        ctx.moveTo(base.x, base.y);

        var center_shift = decisions.centerShift;
        var center = bg.Point2D.create(0.5, 0.5).add(center_shift);

        var direction_straight = center.subtract(base);
        var rot_1 = direction_straight.rotateLeft(decisions.rotateStart);
        rot_1 = rot_1.toAbsoluteLength(0.1);
        var cp_1 = base.add(rot_1);

        var direction_reversed = direction_straight.negative();
        var rot_2 = direction_reversed.rotateLeft(decisions.rotateEnd);
        rot_2 = rot_2.toAbsoluteLength(0.4);
        var cp_2 = center.add(rot_2);

        ctx.bezierCurveTo(
            cp_1.x, cp_1.y,
            cp_2.x, cp_2.y,
            center.x, center.y
            );

        ctx.stroke();

        // Draw a circle...
        ctx.beginPath();
        ctx.arc(center.x, center.y, decisions.centerCircleRadius, 0, Math.PI*2);
        ctx.stroke();

        // Draw some petals...
        ctx.save();
        ctx.translate(center.x, center.y);
        var petal_count = decisions.petalCount;
        var petal_at_radius = decisions.centerCircleRadius;
        var iterator = new bg.CirclePositioner(1., petal_count);
        var pts_length = decisions.petalTypeSequence.length;
        for (var i=0 ; i < petal_count; i++)
        {
            var shift_angle = iterator.angleAt(i);

            ctx.save();
                ctx.rotate(shift_angle);
                ctx.translate(petal_at_radius, 0);
                ctx.scale(decisions.petalRadius, decisions.petalRadius);
                ctx.lineWidth = 0.1;
                ctx.fillStyle = decisions.style.color;
                var petal_type = decisions.petalTypeSequence[i%pts_length] % petalDrawingLib.length;
                var petal_draw = petalDrawingLib[petal_type];
                petal_draw(ctx);
            ctx.restore();
        }
        ctx.restore()
    }
}