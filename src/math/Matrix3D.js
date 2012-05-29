away3d.module('away3d.Matrix3D', null,
function()
{
    var Matrix3D = function(data)
    {
        this.data = data || [
            1, 0, 0, 0, // col 0
            0, 1, 0, 0, // col 1
            0, 0, 1, 0, // col 2
            0, 0, 0, 1  // col 3
        ];
    };

    var m011, m012, m013, m014,
        m021, m022, m023, m024,
        m031, m032, m033, m034,
        m041, m042, m043, m044;

    Matrix3D.prototype.mul = function(m0, m1)
    {
        var i = 4;
        while (i-->0) {
            var j = 4;
            while (j-->0) {
                this.data[i*4+j] = 
                    m0.data[j*4+0] * m1.data[0*4+i] + 
                    m0.data[j*4+1] * m1.data[1*4+i] + 
                    m0.data[j*4+2] * m1.data[2*4+i] + 
                    m0.data[j*4+3] * m1.data[3*4+i];
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

    return Matrix3D;
});
