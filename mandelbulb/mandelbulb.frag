
// Based on Mandelbulb by inigo quilez
// Original code here: https://www.shadertoy.com/view/ltfSWn
// More info here: http://iquilezles.org/www/articles/mandelbulb/mandelbulb.htm

precision mediump float;

uniform float time;
uniform vec3 localCameraPos;
varying vec3 localSurfacePos;

vec2 isphere( in vec4 sph, in vec3 ro, in vec3 rd ) {
    
  vec3 oc = ro - sph.xyz;  
	float b = dot(oc,rd);
	float c = dot(oc,oc) - sph.w*sph.w;
  float h = b*b - c;
    
  if( h<0.0 ) return vec2(-1.0);
  h = sqrt( h );
  return -b + vec2(-h,h);

}

float map( in vec3 p, out vec4 resColor ) {
  
  vec3 w = p;
  float m = dot(w,w);

  vec4 trap = vec4(abs(w),m);
	float dz = 1.0;
    
	for( int i=0; i<4; i++ ) {

      dz = 8.0*pow(sqrt(m),7.0)*dz + 1.0;
		    
      float r = length(w);
      float b = 8.0*acos( w.y/r);
      float a = 8.0*atan( w.x, w.z );
      w = p + pow(r,8.0) * vec3( sin(b)*sin(a), cos(b), sin(b)*cos(a) );

      trap = min( trap, vec4(abs(w),m) );
      m = dot(w,w);
		  if( m > 256.0 )
        break;
      }

    resColor = vec4(m,trap.yzw);
    return 0.25*log(m)*sqrt(m)/dz;
    
}

float intersect( in vec3 ro, in vec3 rd, out vec4 rescol, in float px )
{
  float res = -1.0;

  // bounding sphere
  vec2 dis = isphere( vec4(0.0,0.0,0.0,1.25), ro, rd );
  if( dis.y<0.0 )
      return -1.0;
  dis.x = max( dis.x, 0.0 );
  dis.y = min( dis.y, 10.0 );

  // raymarch fractal distance field
	vec4 trap;

	float t = dis.x;
	for( int i=0; i<128; i++  ) { 
    
    vec3 pos = ro + rd*t;
    float th = 0.25*px*t;
		float h = map( pos, trap );
    
		if( t>dis.y || h<th ) break;
        t += h;
    }
    
    if( t<dis.y )
    {
        rescol = trap;
        res = t;
    }

    return res;
}

float softshadow( in vec3 ro, in vec3 rd, in float k )
{
    float res = 1.0;
    float t = 0.0;
    for( int i=0; i<64; i++ )
    {
        vec4 kk;
        float h = map(ro + rd*t, kk);
        res = min( res, k*h/t );
        if( res<0.001 ) break;
        t += clamp( h, 0.01, 0.2 );
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos, in float t, in float px )
{
    vec4 tmp;
    vec2 e = vec2(1.0,-1.0)*0.5773*0.25*px;
    return normalize( e.xyy*map( pos + e.xyy,tmp ) + 
					  e.yyx*map( pos + e.yyx,tmp ) + 
					  e.yxy*map( pos + e.yxy,tmp ) + 
					  e.xxx*map( pos + e.xxx,tmp ) );
}

const vec3 light1 = vec3(  0.577, 0.577, -0.577 );
const vec3 light2 = vec3( -0.707, 0.000,  0.707 );

vec3 rotate( vec3 v, float a ) {
  return vec3(v.x * cos(a) - v.z * sin(a), v.y, v.x * sin(a) + v.z * cos(a));
}

vec3 render() {

  // rotate
  float angle = time * 0.0001;

	// ray setup
  const float fle = 1.5;
  vec2  sp = localCameraPos.xy;
  float px = 2.0/fle/100.0;

  vec3 ro = rotate(normalize(localSurfacePos) * 1.5, angle) ;
	vec3 rd = rotate(normalize( -localCameraPos ), angle) ;

  // intersect fractal
	vec4 tra;
  float t = intersect( ro, rd, tra, px );
    
	vec3 col;

    // background
    if( t<0.0 ) {
      discard;
  	}
    // color fractal
	else
	{
        // color
        
        col = vec3(0.01);
		    col = mix( col, vec3(0.10,0.20,0.30), clamp(tra.y,0.0,1.0) );
	 	    col = mix( col, vec3(0.02,0.10,0.30), clamp(tra.z*tra.z,0.0,1.0) );
        col = mix( col, vec3(0.30,0.10,0.02), clamp(pow(tra.w,6.0),0.0,1.0) );
        col *= 0.5;
        
		    //col = vec3(0.1);
        
        // lighting terms
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos, t, px );
        vec3 hal = normalize( light1-rd);
        vec3 ref = reflect( rd, nor );
        float occ = clamp(0.05*log(tra.x),0.0,1.0);
        float fac = clamp(1.0+dot(rd,nor),0.0,1.0);

        // sun
        float sha1 = softshadow( pos+0.001*nor, light1, 32.0 );
        float dif1 = clamp( dot( light1, nor ), 0.0, 1.0 )*sha1;
        float spe1 = pow( clamp(dot(nor,hal),0.0,1.0), 32.0 )*dif1*(0.04+0.96*pow(clamp(1.0-dot(hal,light1),0.0,1.0),5.0));
        // bounce
        float dif2 = clamp( 0.5 + 0.5*dot( light2, nor ), 0.0, 1.0 )*occ;
        // sky
        float dif3 = (0.7+0.3*nor.y)*(0.2+0.8*occ);
        
		    vec3 lin = vec3(0.0); 
		    lin += 7.0*vec3(1.50,1.10,0.70)*dif1;
		    lin += 4.0*vec3(0.25,0.20,0.15)*dif2;
        lin += 1.5*vec3(0.10,0.20,0.30)*dif3;
        lin += 2.5*vec3(0.35,0.30,0.25)*(0.05+0.95*occ); // ambient
        lin += 4.0*fac*occ;  // fake SSS
		    col *= lin;
		    col = pow( col, vec3(0.7,0.9,1.0) ); // fake SSS
        col += spe1*15.0;
    }

    // gamma
	  col = sqrt( col );
    
    // vignette
    col *= 1.0 - 0.05*length(sp);
    
    return col;
}
    
void main() {
  gl_FragColor = vec4(render(), 1.0);
}