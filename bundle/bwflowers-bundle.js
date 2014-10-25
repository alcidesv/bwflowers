var bwflowers;
(function (bwflowers) {
    function hashFromString(s) {
        var hash = 0;
        var i;
        if (s.length == 0)
            return hash;
        for (i = 0; i < s.length; i++) {
            var ch = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    bwflowers.hashFromString = hashFromString;
})(bwflowers || (bwflowers = {}));
var basicgeom;
(function (basicgeom) {
    function lowerPrecission(x) {
        return Math.round(x * 100.) / 100.;
    }
    basicgeom.lowerPrecission = lowerPrecission;
    var Point2D = (function () {
        function Point2D(x, y) {
            this.x = x;
            this.y = y;
        }
        Point2D.create = function (x, y) {
            return new Point2D(x, y);
        };
        Point2D.prototype.asCssTranslation = function (unit) {
            unit = unit || "px";
            return "translate( " + String(lowerPrecission(this.x)) + unit + ", " + String(lowerPrecission(this.y)) + unit + ")";
        };
        Point2D.prototype.distanceTo = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Point2D.prototype.distanceToOrigin = function () {
            var dx = this.x;
            var dy = this.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Point2D.prototype.add = function (other) {
            return new Point2D(this.x + other.x, this.y + other.y);
        };
        Point2D.prototype.subtract = function (other) {
            return new Point2D(this.x - other.x, this.y - other.y);
        };
        Point2D.prototype.negative = function () {
            return new Point2D(-this.x, -this.y);
        };
        Point2D.prototype.divide = function (scalar) {
            return new Point2D(this.x / scalar, this.y / scalar);
        };
        Point2D.prototype.multiply = function (scalar) {
            return new Point2D(this.x * scalar, this.y * scalar);
        };
        // Actually treats the point as a vector.. this denotes a counter-clockwise
        // rotation
        Point2D.prototype.rotateLeft = function (angle) {
            var cs = Math.cos(angle);
            var ss = Math.sin(angle);
            var new_x = cs * this.x - ss * this.y;
            var new_y = ss * this.x + cs * this.y;
            return new Point2D(new_x, new_y);
        };
        Point2D.prototype.rotateRight = function (angle) {
            return this.rotateLeft(-angle);
        };
        Point2D.prototype.toAbsoluteLength = function (ll) {
            if (ll == null) {
                ll = 1.;
            }
            var d = this.distanceToOrigin();
            return this.divide(d / ll);
        };
        return Point2D;
    })();
    basicgeom.Point2D = Point2D;
    var Matrix2D = (function () {
        function Matrix2D() {
            this.coord_array = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        Matrix2D.prototype.clone = function () {
            var result = new Matrix2D();
            result.coord_array = this.coord_array.slice(0);
            return result;
        };
        Matrix2D.prototype.toTransform = function () {
            var result = this.clone();
            result.coord_array[6] = 0;
            result.coord_array[7] = 0;
            return result;
        };
        return Matrix2D;
    })();
    basicgeom.Matrix2D = Matrix2D;
    var CirclePositioner = (function () {
        function CirclePositioner(use_radius, piece_count) {
            this.use_radius = use_radius;
            this.piece_count = piece_count;
            this.delta = Math.PI * 2 / piece_count;
        }
        CirclePositioner.prototype.at = function (i) {
            var angle = i * this.delta;
            return new Point2D(Math.cos(angle) * this.use_radius, Math.sin(angle) * this.use_radius);
        };
        CirclePositioner.prototype.angleAt = function (i) {
            return i * this.delta;
        };
        CirclePositioner.prototype.degreeAngleAt = function (i) {
            return i / (Math.PI * 2) * 360.;
        };
        return CirclePositioner;
    })();
    basicgeom.CirclePositioner = CirclePositioner;
    ;
    function sanitizeAngle(angle) {
        if (angle < 0) {
            angle = angle + Math.PI * 2;
        }
        else if (angle > Math.PI * 2) {
            var integer_part = Math.floor(angle / Math.PI / 2.);
            angle = angle - integer_part * Math.PI * 2;
        }
        return angle;
    }
    basicgeom.sanitizeAngle = sanitizeAngle;
})(basicgeom || (basicgeom = {}));
/// <reference path='./basicgeom/basic.ts' />
var bwflowers;
(function (bwflowers) {
    var CompositionDecisions = (function () {
        function CompositionDecisions() {
        }
        return CompositionDecisions;
    })();
    bwflowers.CompositionDecisions = CompositionDecisions;
    var StyleDecisions = (function () {
        function StyleDecisions() {
        }
        return StyleDecisions;
    })();
    bwflowers.StyleDecisions = StyleDecisions;
    var StemDecisions = (function () {
        function StemDecisions() {
        }
        return StemDecisions;
    })();
    bwflowers.StemDecisions = StemDecisions;
})(bwflowers || (bwflowers = {}));
/// <reference path='./decisions.ts' />
/// <reference path='./basicgeom/basic.ts'/>
var bwflowers;
(function (bwflowers) {
    var bg = basicgeom;
    var petalDrawingLib = [
        function (ctx) {
            ctx.beginPath();
            ctx.arc(0.0, 0.5, 0.5, 0.0, Math.PI * 2);
            ctx.stroke();
        },
        function (ctx) {
            ctx.beginPath();
            ctx.arc(0.0, 0.5, 0.5, 0.0, Math.PI * 2);
            ctx.fill();
        },
        function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-0.8, 0.8);
            ctx.lineTo(0.8, 0.8);
            ctx.closePath();
            ctx.stroke();
        },
        function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-0.8, 0.8);
            ctx.lineTo(0.8, 0.8);
            ctx.closePath();
            ctx.fill();
        }
    ];
    function draw(ctx, decisions) {
        ctx.fillStyle = decisions.style.bgColor;
        ctx.rect(0, 0, 1, 1);
        ctx.fill();
        ctx.lineWidth = 1.0 / 40.;
        ctx.strokeStyle = decisions.style.color;
        for (var i = 0; i < decisions.stemCount; i++) {
            drawStem(ctx, decisions.stemDecisions[i]);
        }
    }
    bwflowers.draw = draw;
    function drawStem(ctx, decisions) {
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
        ctx.bezierCurveTo(cp_1.x, cp_1.y, cp_2.x, cp_2.y, center.x, center.y);
        ctx.stroke();
        // Draw a circle...
        ctx.beginPath();
        ctx.arc(center.x, center.y, decisions.centerCircleRadius, 0, Math.PI * 2);
        ctx.stroke();
        // Draw some petals...
        ctx.save();
        ctx.translate(center.x, center.y);
        var petal_count = decisions.petalCount;
        var petal_at_radius = decisions.centerCircleRadius;
        var iterator = new bg.CirclePositioner(1., petal_count);
        var pts_length = decisions.petalTypeSequence.length;
        for (var i = 0; i < petal_count; i++) {
            var shift_angle = iterator.angleAt(i);
            ctx.save();
            ctx.rotate(shift_angle);
            ctx.translate(petal_at_radius, 0);
            ctx.scale(decisions.petalRadius, decisions.petalRadius);
            ctx.lineWidth = 0.1;
            ctx.fillStyle = decisions.style.color;
            var petal_type = decisions.petalTypeSequence[i % pts_length] % petalDrawingLib.length;
            var petal_draw = petalDrawingLib[petal_type];
            petal_draw(ctx);
            ctx.restore();
        }
        ctx.restore();
    }
    bwflowers.drawStem = drawStem;
})(bwflowers || (bwflowers = {}));
/// <reference path='./utils/underscore.d.ts' />
/// <reference path='./utils/jquery.d.ts' />
/// <reference path='./utils/mersenne_twister.d.ts' />
/// <reference path='./utils/hash.ts' />
/// <reference path='./draw.ts'/>
/// <reference path='./decisions.ts'/>
/// <reference path='./basicgeom/basic.ts'/>
var bwflowers;
(function (bwflowers) {
    var bg = basicgeom;
    var DataBundle = (function () {
        function DataBundle(composition_decisions, rng) {
            this.composition_decisions = composition_decisions;
            this.rng = rng;
        }
        return DataBundle;
    })();
    bwflowers.DataBundle = DataBundle;
    function populateStemDecision(stem_decision, rng) {
        stem_decision.centerShift = new bg.Point2D((rng.random() - 0.5) * 0.36, (rng.random() - 0.5) * 0.36);
        stem_decision.rotateStart = (rng.random() - 0.5) * Math.PI / 3;
        stem_decision.rotateEnd = (rng.random() - 0.5) * Math.PI / 3;
        stem_decision.centerCircleRadius = rng.random() * 0.1 + 0.05;
        stem_decision.petalRadius = 0.07 + rng.random() * 0.1;
        stem_decision.petalCount = Math.floor(rng.random() * 10 + 3);
        var petal_type_sequence = [];
        for (var i = 0; i < rng.random() * 2 + 1; i++) {
            petal_type_sequence.push((397 * rng.random()) >> 0);
        }
        stem_decision.petalTypeSequence = petal_type_sequence;
    }
    function assimilateElement(el) {
        var el_styles = window.getComputedStyle(el);
        var style_decisions = new bwflowers.StyleDecisions();
        style_decisions.color = el_styles.color;
        style_decisions.bgColor = el_styles.backgroundColor;
        var width = el.clientWidth;
        var height = el.clientHeight;
        var canvas = $("<canvas width='" + width + "' height='" + height + "'></canvas>");
        var contents_to_hash = el.getAttribute('data-contents-to-hash');
        $(el).empty().append(canvas);
        var rng_seed = bwflowers.hashFromString(contents_to_hash);
        var rng = new MersenneTwister(rng_seed);
        var comp_decisions = new bwflowers.CompositionDecisions();
        comp_decisions.stemCount = (rng.random() * 5 + 1) >> 0;
        var stem_decisions = [];
        for (var i = 0; i < comp_decisions.stemCount; i++) {
            var stem_decision = new bwflowers.StemDecisions();
            stem_decision.style = style_decisions;
            populateStemDecision(stem_decision, rng);
            stem_decisions.push(stem_decision);
        }
        comp_decisions.stemDecisions = stem_decisions;
        comp_decisions.style = style_decisions;
        var bwbundle = new DataBundle(comp_decisions, rng);
        var ctx = canvas.get(0).getContext('2d');
        ctx.scale(width, height);
        bwflowers.draw(ctx, comp_decisions);
        $(canvas).data("bwbundle", bwbundle);
    }
    function assimilate(selector) {
        var els = document.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) {
            assimilateElement(els[i]);
        }
    }
    bwflowers.assimilate = assimilate;
})(bwflowers || (bwflowers = {}));
