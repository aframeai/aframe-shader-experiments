 
      precision mediump float;
      
      uniform float time;
      uniform vec3 localCameraPos;
      varying vec3 localSurfacePos;
      
      const float blobsize = 0.2;
      
      float smoothBlend( float a, float b, float k ){
          float h = clamp(0.5+0.5*(b-a)/k,0.0,1.0);
          return mix(b,a,h) - k*h*(1.0-h);
      }
      
      void hardAdd(inout float curD, float newD){
        curD = min(curD,newD);
      }
      void smoothAdd(inout float curD, float newD, float blendPower){
          curD = smoothBlend( newD, curD, blendPower );
      }
      
      
      float obj_ball(vec3 p, vec3 center, float radius){
          return length(p-center)-radius;
      }
      
      vec3 blobBallPos(float i){
          
          float v = time/1000.0*2.0 + i*100.0;
          return vec3(
            sin( v + sin(v*0.8) + sin(v*0.2)*sin(v*2.1) )*blobsize,
            sin( v + sin(v*0.6) + sin(v*0.4)*sin(v*2.2) )*blobsize,
            sin( v + sin(v*0.4) + sin(v*0.6)*sin(v*2.3) )*blobsize
          );
          
      }
      
      float room(vec3 p){
        
        float distance = 9999.9;
        
        hardAdd(distance, obj_ball(p, blobBallPos(0.0), blobsize) );
        for(float i=1.0; i<8.0; i+=1.0){
          smoothAdd(distance, obj_ball(p, blobBallPos(i), blobsize) , blobsize);
        }
        
        return distance;
        
      }
      
      
      void main() {
        
        
        vec3 curCameraRayUnit = normalize(localSurfacePos - localCameraPos);
        
        
        // zero optimization done to step size, max iterations, etc..!
        const vec3 e=vec3(0.02,0,0);
        const float maxd=40.0; //Max depth
        vec3 c,p,N;
        float sA,sP;
        
        // march to bg
        vec3 color=vec3(1.0,1.0,1.0);
        float f=0.0;
        float d=0.001;
        vec3 surfaceColor;
        for(int i=0;i<64;i++){
          if ((abs(d) < .001) || (f > maxd)) break;
          f+=d;
          p=localCameraPos+curCameraRayUnit*f;
          d = room(p);
        }
        
        float specA=1.0, specP=8.0;
        
        if (f < maxd){
          
          vec3 n = vec3(d-room(p-e.xyy),
                  d-room(p-e.yxy),
                  d-room(p-e.yyx));
          N = normalize(n);
          
          vec3 L = normalize(vec3(1.0,1.0,1.0)-p);
          
          float diffuse=max(dot(N,L),0.0);
          vec3 H = normalize(L-curCameraRayUnit);
          float specular = max(dot(H,N),0.0);
          color = (diffuse*0.8+0.2)*vec3(1.0,0,1.0) + pow(specular,specP)*specA;
          
        } else {
          
          discard;
          
        }
        
        gl_FragColor = vec4(color,1.0);
        
      }