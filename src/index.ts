/// <reference path='./utils/underscore.d.ts' />
/// <reference path='./utils/jquery.d.ts' />
/// <reference path='./utils/mersenne_twister.d.ts' />
/// <reference path='./utils/hash.ts' />
/// <reference path='./draw.ts'/>
/// <reference path='./decisions.ts'/>
/// <reference path='./basicgeom/basic.ts'/>

module bwflowers {

    import bg = basicgeom;

    export class DataBundle {
        constructor (
            public composition_decisions: CompositionDecisions,
            public rng: MersenneTwister
        )
        {

        }
    }

    function populateStemDecision(stem_decision: StemDecisions, rng: MersenneTwister)
    {
        stem_decision.centerShift = new bg.Point2D(
            (rng.random()-0.5)*0.36,
            (rng.random()-0.5)*0.36
        );
        stem_decision.rotateStart = (rng.random()-0.5)*Math.PI/3  ;
        stem_decision.rotateEnd = (rng.random()-0.5)*Math.PI/3  ;
        stem_decision.centerCircleRadius = rng.random()*0.1+0.05;
        stem_decision.petalRadius = 0.07 + rng.random()*0.1;
        stem_decision.petalCount = Math.floor( rng.random()*10 + 3 );

        var petal_type_sequence = [];
        for (var i=0; i < rng.random()*2+1; i++)
        {
            petal_type_sequence.push( (397*rng.random()) >> 0 );
        }
        stem_decision.petalTypeSequence = petal_type_sequence;
    }

    function assimilateElement(el: HTMLElement): void {
        var el_styles = window.getComputedStyle(el);
        var style_decisions = new StyleDecisions();
        style_decisions.color = el_styles.color;
        style_decisions.bgColor = el_styles.backgroundColor;
        var width = el.clientWidth;
        var height = el.clientHeight;
        var canvas = $("<canvas width='"+ width +"' height='"+ height +"'></canvas>");
        var contents_to_hash = el.getAttribute('data-contents-to-hash')
        $(el).empty().append(canvas);

        var rng_seed = hashFromString(contents_to_hash);
        var rng = new MersenneTwister(rng_seed);

        var comp_decisions = new CompositionDecisions();
        comp_decisions.stemCount = (rng.random()*5+1)>>0;

        var stem_decisions = [];
        for (var i=0; i < comp_decisions.stemCount; i++)
        {
            var stem_decision = new StemDecisions();
            stem_decision.style = style_decisions;
            populateStemDecision(stem_decision, rng);
            stem_decisions.push(stem_decision);
        }
        comp_decisions.stemDecisions = stem_decisions;

        comp_decisions.style = style_decisions;

        var bwbundle = new DataBundle(
            comp_decisions,
            rng
        );

        var ctx = (<HTMLCanvasElement><any> canvas.get(0)).getContext('2d');
        ctx.scale(width, height);

        draw(ctx, comp_decisions);

        $(canvas).data("bwbundle", bwbundle);
    }

    export function assimilate(selector:string): void {
        var els  = document.querySelectorAll(selector);

        for (var i=0 ; i < els.length; i++)
        {
            assimilateElement(<HTMLElement>els[i]);
        }

    }

}