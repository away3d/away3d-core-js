away3d.module('away3d.Matrix3D', null,
function()
{
    var Matrix3D = function(data)
    {
        this.data = data? new Float32Array(data) : new Float32Array([
            1, 0, 0, 0, // col 0
            0, 1, 0, 0, // col 1
            0, 0, 1, 0, // col 2
            0, 0, 0, 1  // col 3
        ]);
    };

    var m011, m012, m013, m014,
        m021, m022, m023, m024,
        m031, m032, m033, m034,
        m041, m042, m043, m044;

    var tmp0 = new Float32Array(16);
    var tmp1 = new Float32Array(16);

    var copyData = function(to, from)
    {
        var i = 16;
        while (i-->0)
            to[i] = from[i];
        return to;
    };

    Matrix3D.Translation = function(x, y, z, mtx)
    {
        mtx = mtx || new Matrix3D();
        mtx.data[0] = 1;
        mtx.data[5] = 1;
        mtx.data[10] = 1;
        mtx.data[12] = x;
        mtx.data[13] = y;
        mtx.data[14] = z;

        return mtx;
    };

    Matrix3D.Scale = function(x, y, z, mtx)
    {
        mtx = mtx || new Matrix3D();
        mtx.data[0] = x;
        mtx.data[5] = y;
        mtx.data[10] = z;

        return mtx;
    };

    var tmpRx = new Matrix3D(),
        tmpRy = new Matrix3D(),
        tmpRz = new Matrix3D();

    // TODO: Research faster way of composing rotation matrix
    Matrix3D.Rotation = function(x, y, z, mtx)
    {
        var rx = tmpRx, ry = tmpRy, rz = tmpRz,
            mtx = mtx || new Matrix3D();

        rx.data[0] = 1;
        rx.data[5] = Math.cos(x);
        rx.data[6] = Math.sin(x);
        rx.data[9] = -rx.data[6];
        rx.data[10] = rx.data[5];
        rx.data[15] = 1;

        ry.data[0] = Math.cos(y);
        ry.data[2] = -Math.sin(y);
        ry.data[5] = 1;
        ry.data[8] = -ry.data[2];
        ry.data[10] = ry.data[0];
        ry.data[15] = 1;

        rz.data[0] = Math.cos(z);
        rz.data[1] = Math.sin(z);
        rz.data[4] = -rz.data[1];
        rz.data[5] = rz.data[0];
        rz.data[10] = 1;
        rz.data[15] = 1;

        mtx.mul(rx, ry);
        mtx.mul(mtx, rz);

        return mtx;
    };

    Matrix3D.prototype.mul = function(m0, m1)
    {
        var md0 = (m0==this)? copyData(tmp0, m0.data) : m0.data,
            md1 = (m1==this)? copyData(tmp1, m1.data) : m1.data,
            i = 4;

        while (i-->0) {
            var j = 4;
            while (j-->0) {
                this.data[j*4+i] = 
                    md0[j*4+0] * md1[0*4+i] + 
                    md0[j*4+1] * md1[1*4+i] + 
                    md0[j*4+2] * md1[2*4+i] + 
                    md0[j*4+3] * md1[3*4+i];
            }
        };
    };

    Matrix3D.prototype.det = function()
    {
        var md = this.data;
        return (md[0] * md[5] - md[1] * md[4]) * md[10]
             - (md[0] * md[6] - md[2] * md[4]) * md[9]
             + (md[1] * md[6] - md[2] * md[5]) * md[8];

    };

    Matrix3D.prototype.inv = function(m)
    {
        var m, md, d;

        if (!m) {
            // Inverse self if no parameter given
            m = this;
        }

        md = m.data;
        d = m.det();

        if (Math.abs(d) < 0.00001) {
            // Can't do anything when determinant is zero
            return false;
        }

        m011 = md[0];  m021 = md[1];  m031 = md[2];  m041 = md[3];  // Col 0
        m012 = md[4];  m022 = md[5];  m032 = md[6];  m042 = md[7];  // Col 1
        m013 = md[8];  m023 = md[9];  m033 = md[10]; m043 = md[11]; // Col 2
        m014 = md[12]; m024 = md[13]; m034 = md[14]; m044 = md[15]; // Col 3
        
        d = 1 / d;

        md = this.data;
        md[0]  =  d * (m022 * m033 - m032 * m023);
        md[4]  = -d * (m012 * m033 - m032 * m013);
        md[8]  =  d * (m012 * m023 - m022 * m013);
        md[12] = -d * (m012 * (m023*m034 - m033*m024) - m022 * (m013*m034 - m033*m014) + m032 * (m013*m024 - m023*m014));
        md[1]  = -d * (m021 * m033 - m031 * m023);
        md[5]  =  d * (m011 * m033 - m031 * m013);
        md[9]  = -d * (m011 * m023 - m021 * m013);
        md[13] =  d * (m011 * (m023*m034 - m033*m024) - m021 * (m013*m034 - m033*m014) + m031 * (m013*m024 - m023*m014));
        md[2]  =  d * (m021 * m023 - m031 * m022);
        md[6]  = -d * (m011 * m023 - m031 * m012);
        md[10] =  d * (m011 * m022 - m021 * m012);
        md[14] = -d * (m011 * (m022*m034 - m032*m024) - m021 * (m012*m034 - m032*m014) + m031 * (m012*m024 - m022*m014));

        return true;
    };

    Matrix3D.prototype.identity = function()
    {
        var md = this.data;
        md[0] = md[5] = md[10] = md[15] = 1;
        md[1] = md[2] = md[3] = md[4] = md[6] = md[7] = md[8] =
        md[9] = md[11] = md[12] = md[13] = md[14] = 0;
    };

    Matrix3D.prototype.copyFrom = function(mtx)
    {
        copyData(this.data, mtx.data);
    };

    return Matrix3D;
});
