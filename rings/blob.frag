#define PI 3.1415926535897932384626433832795

precision mediump float;

uniform float time;
uniform vec3 localCameraPos;
varying vec3 localSurfacePos;

const float blobsize = 0.2;
uniform vec3 surfaceColor;

float opSmoothUnion( float d1, float d2, float k ) {
  float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
  return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float opUnion(float curD, float newD){
  return min(curD, newD);
}
      
float sdBall(vec3 p, float s){
    return length(p) - s;
}

vec3 blobBallPos(float i){
    
    float v = time/1000.0*2.0 + i*100.0;
    return vec3(
      sin( v + sin(v*0.8) + sin(v*0.2) * sin(v*2.1) ) * blobsize,
      sin( v + sin(v*0.6) + sin(v*0.4) * sin(v*2.2) ) * blobsize,
      sin( v + sin(v*0.4) + sin(v*0.6) * sin(v*2.3) ) * blobsize
    );
    
}

float room(vec3 p){
  
  float distance = 9999.9;


  for(float i=1.0; i<9.0; i+=1.0){
    float torus = sdBall( p.xyz - blobBallPos(i), blobsize);
    distance = opSmoothUnion(distance, torus, blobsize );
    distance = opUnion(distance, torus );
  }
  
  return distance;        
}


void main() {
  
  
  vec3 curCameraRayUnit = normalize(localSurfacePos - localCameraPos);
  
  
  // zero optimization done to step size, max iterations, etc..!
  const vec3 e = vec3(0.001, 0, 0);
  const float maxd = 20.0; //Max depth
  vec3 c,p,N;
  float sA,sP;
  
  // march to bg
  vec3 color=vec3(1.0);
  float f=0.0;
  float d=0.001;
  for(int i=0;i<64;i++){
    if ((abs(d) < .001) || (f > maxd)) break;
    f+=d;
    p=localCameraPos+curCameraRayUnit*f;
    d = room(p);
  }
  
  float specA=1.0, specP=8.0;
  
  if (f < maxd){
    
    vec3 n = d - vec3(
      room(p-e.xyy),
      room(p-e.yxy),
      room(p-e.yyx)
    );

    N = normalize(n);
    
    vec3 L = normalize(vec3(1.0,1.0,1.0)-p);
    
    float diffuse = max(dot(N,L),0.0);
    vec3 H = normalize(L-curCameraRayUnit);
    float specular = max(dot(H,N),0.0);
    color = (diffuse*0.8+0.2) * surfaceColor + pow(specular,specP)*specA;
    
  } else {
    
    discard;
    
  }
  
  gl_FragColor = vec4(color, 1.0);
  
}