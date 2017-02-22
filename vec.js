var Vec = function (x, y) {
    this.x = x;
    this.y = y;
};

Vec.prototype.set = function (x, y) {
    if (y == null) {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
    return this;
};

//Negative functions
Vec.prototype.negi = function () {
    return this.neg(this);
};
Vec.prototype.neg = function (out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = -this.x;
    out.y = -this.y;
    return out;
};

//Multiplication
Vec.prototype.muli = function (s) {
    return this.mul(s, this);
};
Vec.prototype.mul = function (s, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = s * this.x;
    out.y = s * this.y;
    return out;
};

Vec.prototype.mulVeci = function (v) {
    return this.mulVec(v, this);
};
Vec.prototype.mulVec = function (v, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x * v.x;
    out.y = this.y * v.y;
    return out;
};

//Division
Vec.prototype.divi = function (s) {
    return this.div(s, this);
};
Vec.prototype.div = function (s, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x / s;
    out.y = this.y / s;
    return out;
};

Vec.prototype.divVeci = function (v) {
    return this.divVec(v, this);
};
Vec.prototype.divVec = function (v, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x / v.x;
    out.y = this.y / v.y;
    return out;
};

//Addition
Vec.prototype.addi = function (s) {
    return this.add(s, this);
};
Vec.prototype.add = function (s, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x + s;
    out.y = this.y + s;
    return out;
};

Vec.prototype.addVeci = function (v) {
    return this.addVec(v, this);
};
Vec.prototype.addVec = function (v, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x + v.x;
    out.y = this.y + v.y;
    return out;
};

//Subtraction
Vec.prototype.subVeci = function (v) {
    return this.subVec(v, this);
};
Vec.prototype.subVec = function (v, out) {
    if (out == null) {
        out = new Vec(0, 0);
    }
    out.x = this.x - v.x;
    out.y = this.y - v.y;
    return out;
};


Vec.prototype.lengthSq = function () {
    return (this.x * this.x) + (this.y * this.y);
};
Vec.prototype.length = function () {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};


Vec.prototype.rotate = function (radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    var xp = (this.x * c) - (this.y * s);
    var yp = (this.x * s) + (this.y * c);

    this.x = xp;
    this.y = yp;
};


Vec.prototype.dot = function (vecA, vecB) {
    return (vecA.x * vecB.x) + (vecA.y * vecB.y);
};
Vec.prototype.dot = function (v) {
    return this.dot(this, v);
};


Vec.prototype.distanceSq = function (v) {
    return this.distanceSq(this, v);
};
Vec.prototype.distance = function (v) {
    return this.distance(this, v);
};
Vec.prototype.distanceSq = function (vecA, vecB) {
    var dx = vecA.x - vecB.x;
    var dy = vecA.y - vecB.y;

    return (dx * dx) + (dy * dy);
};
Vec.prototype.distance = function (vecA, vecB) {
    var dx = vecA.x - vecB.x;
    var dy = vecA.y - vecB.y;

    return Math.sqrt((dx * dx) + (dy * dy));
};


Vec.prototype.crossiVA = function (v, a) {
    return this.crossVA(v, a, this);
};
Vec.prototype.crossiAV = function (a, v) {
    return this.crossAV(a, v, this);
};
Vec.prototype.crossi = function (v) {
    return this.cross(this, v);
};

Vec.prototype.cross = function (vecA, vecB) {
    return (vecA.x * vecB.y) - (vecA.y * vecB.x);
};
Vec.prototype.crossVA = function (v, a, out) {
    out.x = v.y * a;
    out.y = v.x * -a;
    return out;
};
Vec.prototype.crossAV = function (a, v, out) {
    out.x = v.y * -a;
    out.y = v.x * a;
    return out;
};


Vec.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
};

Vec.prototype.toString = function () {
    return this.x+", "+this.y;
};