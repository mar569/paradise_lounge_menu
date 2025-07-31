"use client";
import { useEffect, useRef, useState } from "react";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (1.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
  float t = iTime * 0.4; 
  
  vec2 mouse_uv = (4.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);
  
  float mouseInfluence = 0.0;
  if (length(iMouse) > 0.0) {
    float dist_to_mouse = distance(uv, mouse_uv);
    mouseInfluence = smoothstep(0.8, 0.0, dist_to_mouse);
  }
  
  for(float i = 8.0; i < 20.0; i++) {
    uv.x += 0.4 / i * cos(i * 2.5 * uv.y + t);
    uv.y += 0.4 / i * cos(i * 1.5 * uv.x + t);
  }
  
  float wave = abs(sin(t - uv.y - uv.x + mouseInfluence * 5.0));
  float glow = smoothstep(0.8, 0.0, wave) * 0.7; 
  
  vec3 color = glow * u_color * 0.8 * 0.5; 
  
  fragColor = vec4(color, 0.8); 
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

interface ShaderBackgroundProps {
    className?: string;
    color?: string;
    backdropBlurAmount?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export default function ShaderBackground({
    className = "",
    color = "#07eae6",
    backdropBlurAmount = "md"
}: ShaderBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(program, "iResolution");
        const timeLocation = gl.getUniformLocation(program, "iTime");
        const mouseLocation = gl.getUniformLocation(program, "iMouse");
        const colorLocation = gl.getUniformLocation(program, "u_color");

        // Конвертация цвета hex в RGB
        const [r, g, b] = [
            parseInt(color.slice(1, 3), 16) / 255,
            parseInt(color.slice(3, 5), 16) / 255,
            parseInt(color.slice(5, 7), 16) / 255
        ];

        const startTime = Date.now();
        let animationId: number;

        const render = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            gl.uniform2f(resolutionLocation, width, height);
            gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);
            gl.uniform2f(
                mouseLocation,
                isHovering ? mousePos.x : 0,
                isHovering ? height - mousePos.y : 0
            );
            gl.uniform3f(colorLocation, r, g, b);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseenter', () => setIsHovering(true));
        canvas.addEventListener('mouseleave', () => setIsHovering(false));

        render();

        return () => {
            cancelAnimationFrame(animationId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseenter', () => setIsHovering(true));
            canvas.removeEventListener('mouseleave', () => setIsHovering(false));
        };
    }, [color, isHovering, mousePos]);

    const blurClasses = {
        none: '',
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
        '2xl': 'backdrop-blur-2xl',
        '3xl': 'backdrop-blur-3xl'
    };

    return (
        <div className={`absolute inset-0 w-full h-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            <div className={`absolute inset-0 ${blurClasses[backdropBlurAmount]}`} />
        </div>
    );
}
