
        // Enhanced scene setup with better performance
        let scene, camera, renderer, composer;
        let planets = {};
        let sun, sunGlow;
        let clock = new THREE.Clock();
        let isPaused = false;
        let isDarkMode = true;
        let stars, nebula;
        let orbitTrails = {};
        let asteroidBelt = [];
        
        // Enhanced planet data with more realistic properties
        const planetData = {
            mercury: { 
                distance: 12, size: 0.4, color: 0x8C7853, speed: 0.048, 
                name: "Mercury", info: "Closest to Sun • Extreme temperatures • No atmosphere",
                emissive: 0x332211, emissiveIntensity: 0.1
            },
            venus: { 
                distance: 16, size: 0.6, color: 0xFFB649, speed: 0.035, 
                name: "Venus", info: "Hottest planet • Dense atmosphere • Retrograde rotation",
                emissive: 0x443311, emissiveIntensity: 0.15
            },
            earth: { 
                distance: 20, size: 0.65, color: 0x4F94CD, speed: 0.03, 
                name: "Earth", info: "Our home • 71% water • Perfect for life",
                emissive: 0x001133, emissiveIntensity: 0.1
            },
            mars: { 
                distance: 25, size: 0.5, color: 0xCD5C5C, speed: 0.024, 
                name: "Mars", info: "Red planet • Polar ice caps • Largest volcano",
                emissive: 0x331111, emissiveIntensity: 0.12
            },
            jupiter: { 
                distance: 35, size: 1.8, color: 0xD8CA9D, speed: 0.013, 
                name: "Jupiter", info: "Gas giant • Great Red Spot • 80+ moons",
                emissive: 0x332211, emissiveIntensity: 0.08
            },
            saturn: { 
                distance: 45, size: 1.5, color: 0xFFD700, speed: 0.0097, 
                name: "Saturn", info: "Ring system • Low density • Hexagonal storm",
                emissive: 0x332200, emissiveIntensity: 0.1
            },
            uranus: { 
                distance: 55, size: 1.2, color: 0x4FD0E7, speed: 0.0068, 
                name: "Uranus", info: "Ice giant • Tilted 98° • Methane atmosphere",
                emissive: 0x001133, emissiveIntensity: 0.15
            },
            neptune: { 
                distance: 65, size: 1.15, color: 0x4169E1, speed: 0.0054, 
                name: "Neptune", info: "Windiest planet • Deep blue • Farthest from Sun",
                emissive: 0x000033, emissiveIntensity: 0.2
            }
        };

        // Initialize enhanced scene
        function init() {
            createScene();
            createCamera();
            createRenderer();
            createControls();
            createEnhancedLighting();
            createStarfield();
            createNebula();
            createSun();
            createPlanets();
            createAsteroidBelt();
            createOrbitTrails();
            setupEventListeners();
            
            // Hide loading and start animation
            document.querySelector('.loading').style.display = 'none';
            animate();
        }

        function createScene() {
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x000011, 100, 300);
        }

        function createCamera() {
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 30, 80);
            camera.lookAt(0, 0, 0);
        }

        function createRenderer() {
            renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000011, 1);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.autoUpdate = true;
            renderer.physicallyCorrectLights = true;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            
            document.getElementById('canvas-container').appendChild(renderer.domElement);
        }

        function createControls() {
            let mouseDown = false;
            let mouseX = 0, mouseY = 0;
            let rotationX = 0.3, rotationY = 0;
            let targetRotationX = 0.3, targetRotationY = 0;
            let cameraDistance = 80;
            let targetDistance = 80;
            
            function updateCamera() {
                // Smooth camera interpolation
                rotationX += (targetRotationX - rotationX) * 0.05;
                rotationY += (targetRotationY - rotationY) * 0.05;
                cameraDistance += (targetDistance - cameraDistance) * 0.05;
                
                camera.position.x = cameraDistance * Math.sin(rotationY) * Math.cos(rotationX);
                camera.position.y = cameraDistance * Math.sin(rotationX);
                camera.position.z = cameraDistance * Math.cos(rotationY) * Math.cos(rotationX);
                camera.lookAt(0, 0, 0);
            }
            
            renderer.domElement.addEventListener('mousedown', (e) => {
                mouseDown = true;
                mouseX = e.clientX;
                mouseY = e.clientY;
                document.body.style.cursor = 'grabbing';
            });
            
            renderer.domElement.addEventListener('mouseup', () => {
                mouseDown = false;
                document.body.style.cursor = 'grab';
            });
            
            renderer.domElement.addEventListener('mouseleave', () => {
                mouseDown = false;
                document.body.style.cursor = 'grab';
            });
            
            renderer.domElement.addEventListener('mousemove', (e) => {
                if (!mouseDown) return;
                
                const deltaX = e.clientX - mouseX;
                const deltaY = e.clientY - mouseY;
                
                targetRotationY += deltaX * 0.008;
                targetRotationX += deltaY * 0.008;
                targetRotationX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, targetRotationX));
                
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            renderer.domElement.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
                targetDistance *= zoomFactor;
                targetDistance = Math.max(25, Math.min(200, targetDistance));
            });
            
            // Smooth camera updates
            const cameraLoop = () => {
                updateCamera();
                requestAnimationFrame(cameraLoop);
            };
            cameraLoop();
        }

        function createEnhancedLighting() {
            // Enhanced ambient lighting
            const ambientLight = new THREE.AmbientLight(0x404080, 0.15);
            scene.add(ambientLight);
            
            // Main sun light
            const sunLight = new THREE.PointLight(0xFFFFAA, 3, 0, 2);
            sunLight.position.set(0, 0, 0);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 4096;
            sunLight.shadow.mapSize.height = 4096;
            sunLight.shadow.camera.near = 0.1;
            sunLight.shadow.camera.far = 200;
            sunLight.shadow.bias = -0.0001;
            scene.add(sunLight);
            
            // Rim lighting
            const rimLight = new THREE.DirectionalLight(0x4488FF, 0.5);
            rimLight.position.set(50, 50, 50);
            scene.add(rimLight);
        }

        function createStarfield() {
            // Enhanced starfield with multiple layers
            const starGroup = new THREE.Group();
            
            // Main stars
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 15000;
            const starPositions = new Float32Array(starCount * 3);
            const starColors = new Float32Array(starCount * 3);
            const starSizes = new Float32Array(starCount);
            
            for (let i = 0; i < starCount; i++) {
                const i3 = i * 3;
                
                // Position
                starPositions[i3] = (Math.random() - 0.5) * 2000;
                starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
                starPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
                
                // Color variation
                const temp = Math.random();
                if (temp > 0.8) {
                    starColors[i3] = 0.8 + Math.random() * 0.2;     // Red giants
                    starColors[i3 + 1] = 0.2 + Math.random() * 0.3;
                    starColors[i3 + 2] = 0.1 + Math.random() * 0.2;
                } else if (temp > 0.6) {
                    starColors[i3] = 0.3 + Math.random() * 0.4;     // Blue giants
                    starColors[i3 + 1] = 0.4 + Math.random() * 0.4;
                    starColors[i3 + 2] = 0.8 + Math.random() * 0.2;
                } else {
                    starColors[i3] = 0.8 + Math.random() * 0.2;     // White/yellow stars
                    starColors[i3 + 1] = 0.8 + Math.random() * 0.2;
                    starColors[i3 + 2] = 0.6 + Math.random() * 0.4;
                }
                
                // Size variation
                starSizes[i] = Math.random() * 2 + 0.5;
            }
            
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
            starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
            
            const starMaterial = new THREE.PointsMaterial({
                size: 1,
                sizeAttenuation: false,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            });
            
            stars = new THREE.Points(starGeometry, starMaterial);
            starGroup.add(stars);
            
            scene.add(starGroup);
        }

        function createNebula() {
            // Create a subtle nebula effect
            const nebulaGeometry = new THREE.PlaneGeometry(400, 400);
            const nebulaMaterial = new THREE.MeshBasicMaterial({
                color: 0x4411AA,
                transparent: true,
                opacity: 0.03,
                side: THREE.DoubleSide
            });
            
            for (let i = 0; i < 5; i++) {
                const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
                nebulaMesh.position.set(
                    (Math.random() - 0.5) * 300,
                    (Math.random() - 0.5) * 300,
                    (Math.random() - 0.5) * 300
                );
                nebulaMesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                scene.add(nebulaMesh);
            }
        }

        function createSun() {
            // Enhanced sun with glow effect
            const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
            const sunMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFAA00,
                emissive: 0xFFAA00,
                emissiveIntensity: 0.8
            });
            
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            scene.add(sun);
            
            // Sun glow effect
            const glowGeometry = new THREE.SphereGeometry(4.5, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFAA00,
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
            });
            
            sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(sunGlow);
            
            // Solar flares
            const flareGeometry = new THREE.SphereGeometry(3.2, 16, 16);
            const flareMaterial = new THREE.MeshBasicMaterial({
                color: 0xFF6600,
                transparent: true,
                opacity: 0.6,
                side: THREE.BackSide
            });
            
            const flare = new THREE.Mesh(flareGeometry, flareMaterial);
            sun.add(flare);
        }

        function createPlanets() {
            Object.keys(planetData).forEach(planetName => {
                const data = planetData[planetName];
                
                // Enhanced planet geometry with more detail
                const geometry = new THREE.SphereGeometry(data.size, 32, 32);
                const material = new THREE.MeshPhongMaterial({ 
                    color: data.color,
                    emissive: data.emissive,
                    emissiveIntensity: data.emissiveIntensity,
                    shininess: 30,
                    specular: 0x222222
                });
                
                const planet = new THREE.Mesh(geometry, material);
                planet.receiveShadow = true;
                planet.castShadow = true;
                
                // Create orbit group
                const orbitGroup = new THREE.Group();
                orbitGroup.add(planet);
                scene.add(orbitGroup);
                
                // Position planet
                planet.position.x = data.distance;
                
                // Add planet-specific features
                if (planetName === 'saturn') {
                    // Enhanced Saturn rings
                    const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2.2, 64);
                    const ringMaterial = new THREE.MeshPhongMaterial({ 
                        color: 0xFFD700,
                        transparent: true,
                        opacity: 0.7,
                        side: THREE.DoubleSide,
                        emissive: 0x221100,
                        emissiveIntensity: 0.1
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2;
                    ring.receiveShadow = true;
                    planet.add(ring);
                    
                    // Ring particles for more realism
                    const particleGeometry = new THREE.BufferGeometry();
                    const particleCount = 2000;
                    const positions = new Float32Array(particleCount * 3);
                    
                    for (let i = 0; i < particleCount; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = data.size * 1.3 + Math.random() * (data.size * 0.9);
                        
                        positions[i * 3] = Math.cos(angle) * radius;
                        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
                        positions[i * 3 + 2] = Math.sin(angle) * radius;
                    }
                    
                    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const particleMaterial = new THREE.PointsMaterial({
                        color: 0xFFD700,
                        size: 0.02,
                        transparent: true,
                        opacity: 0.6
                    });
                    
                    const particles = new THREE.Points(particleGeometry, particleMaterial);
                    planet.add(particles);
                }
                
                if (planetName === 'earth') {
                    // Add Earth's atmosphere
                    const atmosphereGeometry = new THREE.SphereGeometry(data.size * 1.05, 32, 32);
                    const atmosphereMaterial = new THREE.MeshBasicMaterial({
                        color: 0x4488FF,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.BackSide
                    });
                    
                    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                    planet.add(atmosphere);
                    
                    // Add moon
                    const moonGeometry = new THREE.SphereGeometry(data.size * 0.27, 16, 16);
                    const moonMaterial = new THREE.MeshPhongMaterial({
                        color: 0xCCCCCC,
                        shininess: 5
                    });
                    
                    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                    moon.position.x = data.size * 3;
                    moon.receiveShadow = true;
                    moon.castShadow = true;
                    planet.add(moon);
                }
                
                if (planetName === 'jupiter') {
                    // Add Jupiter's Great Red Spot
                    const spotGeometry = new THREE.SphereGeometry(data.size * 0.3, 16, 16);
                    const spotMaterial = new THREE.MeshPhongMaterial({
                        color: 0xFF4444,
                        transparent: true,
                        opacity: 0.8,
                        emissive: 0x220000,
                        emissiveIntensity: 0.2
                    });
                    
                    const spot = new THREE.Mesh(spotGeometry, spotMaterial);
                    spot.position.x = data.size * 0.9;
                    planet.add(spot);
                }
                
                // Store planet data with enhanced properties
                planets[planetName] = {
                    mesh: planet,
                    orbitGroup: orbitGroup,
                    distance: data.distance,
                    speed: data.speed,
                    baseSpeed: data.speed,
                    angle: Math.random() * Math.PI * 2,
                    rotationSpeed: 0.01 + Math.random() * 0.02,
                    data: data
                };
            });
        }

        function createAsteroidBelt() {
            // Create asteroid belt between Mars and Jupiter
            const asteroidGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const asteroidMaterial = new THREE.MeshPhongMaterial({
                color: 0x666666,
                shininess: 5
            });
            
            for (let i = 0; i < 500; i++) {
                const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
                const angle = Math.random() * Math.PI * 2;
                const radius = 28 + Math.random() * 5; // Between Mars and Jupiter
                
                asteroid.position.x = Math.cos(angle) * radius;
                asteroid.position.z = Math.sin(angle) * radius;
                asteroid.position.y = (Math.random() - 0.5) * 2;
                
                asteroid.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                
                asteroid.receiveShadow = true;
                asteroid.castShadow = true;
                
                asteroidBelt.push({
                    mesh: asteroid,
                    angle: angle,
                    radius: radius,
                    speed: 0.005 + Math.random() * 0.01,
                    rotationSpeed: (Math.random() - 0.5) * 0.05
                });
                
                scene.add(asteroid);
            }
        }

        function createOrbitTrails() {
            // Create subtle orbit trails
            Object.keys(planetData).forEach(planetName => {
                const data = planetData[planetName];
                const points = [];
                
                for (let i = 0; i <= 128; i++) {
                    const angle = (i / 128) * Math.PI * 2;
                    points.push(new THREE.Vector3(
                        Math.cos(angle) * data.distance,
                        0,
                        Math.sin(angle) * data.distance
                    ));
                }
                
                const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const orbitMaterial = new THREE.LineBasicMaterial({
                    color: 0x444444,
                    transparent: true,
                    opacity: 0.2
                });
                
                const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
                orbitTrails[planetName] = orbitLine;
                scene.add(orbitLine);
            });
        }

        function setupEventListeners() {
            // Enhanced speed sliders with smooth animations
            Object.keys(planetData).forEach(planetName => {
                const slider = document.getElementById(`${planetName}-speed`);
                const valueDisplay = document.getElementById(`${planetName}-value`);
                
                slider.addEventListener('input', (e) => {
                    const multiplier = parseFloat(e.target.value);
                    planets[planetName].speed = planets[planetName].baseSpeed * multiplier;
                    valueDisplay.textContent = `${multiplier.toFixed(1)}x`;
                    
                    // Visual feedback
                    valueDisplay.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        valueDisplay.style.transform = 'scale(1)';
                    }, 150);
                });
            });
            
            // Enhanced pause button
            document.getElementById('pauseBtn').addEventListener('click', () => {
                isPaused = !isPaused;
                const btn = document.getElementById('pauseBtn');
                btn.innerHTML = isPaused ? '▶ Resume' : '⏸ Pause';
                btn.classList.toggle('pause');
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });
            
            // Enhanced theme toggle
            document.getElementById('themeBtn').addEventListener('click', () => {
                isDarkMode = !isDarkMode;
                const btn = document.getElementById('themeBtn');
                
                if (isDarkMode) {
                    renderer.setClearColor(0x000011);
                    btn.innerHTML = '🌙 Light';
                    stars.visible = true;
                    Object.values(orbitTrails).forEach(trail => {
                        trail.material.color.setHex(0x444444);
                    });
                } else {
                    renderer.setClearColor(0x1a1a2e);
                    btn.innerHTML = '☀️ Dark';
                    stars.visible = false;
                    Object.values(orbitTrails).forEach(trail => {
                        trail.material.color.setHex(0x666666);
                    });
                }
                
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });
            
            // Reset button
            document.getElementById('resetBtn').addEventListener('click', () => {
                Object.keys(planets).forEach(planetName => {
                    const slider = document.getElementById(`${planetName}-speed`);
                    const valueDisplay = document.getElementById(`${planetName}-value`);
                    
                    slider.value = 1;
                    planets[planetName].speed = planets[planetName].baseSpeed;
                    valueDisplay.textContent = '1.0x';
                });
                
                const btn = document.getElementById('resetBtn');
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 100);
            });
            
            // Enhanced planet tooltips with smooth animations
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const tooltip = document.getElementById('tooltip');
            let currentPlanet = null;
            
            renderer.domElement.addEventListener('mousemove', (e) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                
                raycaster.setFromCamera(mouse, camera);
                
                const planetMeshes = Object.values(planets).map(p => p.mesh);
                const intersects = raycaster.intersectObjects(planetMeshes);
                
                if (intersects.length > 0) {
                    const intersectedObject = intersects[0].object;
                    const planetName = Object.keys(planets).find(name => 
                        planets[name].mesh === intersectedObject
                    );
                    
                    if (planetName && planetName !== currentPlanet) {
                        currentPlanet = planetName;
                        const data = planets[planetName].data;
                        const speedMultiplier = planets[planetName].speed / planets[planetName].baseSpeed;
                        
                        tooltip.innerHTML = `
                            <div style="color: #00d4ff; font-weight: bold; margin-bottom: 8px;">
                                ${data.name}
                            </div>
                            <div style="font-size: 11px; line-height: 1.4;">
                                ${data.info}<br><br>
                                <span style="color: #ffd700;">Distance:</span> ${data.distance} AU<br>
                                <span style="color: #ffd700;">Size:</span> ${data.size.toFixed(1)} units<br>
                                <span style="color: #ffd700;">Speed:</span> ${speedMultiplier.toFixed(1)}x normal
                            </div>
                        `;
                        tooltip.style.display = 'block';
                    }
                    
                    tooltip.style.left = Math.min(e.clientX + 15, window.innerWidth - 200) + 'px';
                    tooltip.style.top = Math.min(e.clientY + 15, window.innerHeight - 150) + 'px';
                } else {
                    tooltip.style.display = 'none';
                    currentPlanet = null;
                }
            });
            
            renderer.domElement.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
                currentPlanet = null;
            });
            
            // Enhanced window resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            
            if (!isPaused) {
                const deltaTime = clock.getDelta();
                const elapsedTime = clock.getElapsedTime();
                
                // Enhanced sun animation
                sun.rotation.y += deltaTime * 0.5;
                sunGlow.rotation.y += deltaTime * 0.3;
                sunGlow.rotation.z += deltaTime * 0.2;
                
                // Pulsing sun effect
                const pulseFactor = 1 + Math.sin(elapsedTime * 2) * 0.05;
                sun.scale.setScalar(pulseFactor);
                
                // Animate planets with enhanced effects
                Object.keys(planets).forEach(planetName => {
                    const planet = planets[planetName];
                    
                    // Update orbit
                    planet.angle += planet.speed * deltaTime;
                    
                    // Smooth orbital motion
                    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
                    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
                    
                    // Enhanced planet rotation
                    planet.mesh.rotation.y += planet.rotationSpeed * deltaTime;
                    
                    // Subtle wobble for realism
                    planet.mesh.position.y = Math.sin(planet.angle * 3) * 0.1;
                    
                    // Special animations for specific planets
                    if (planetName === 'saturn') {
                        // Rotate Saturn's rings
                        const rings = planet.mesh.children.find(child => child.geometry.type === 'RingGeometry');
                        if (rings) {
                            rings.rotation.z += deltaTime * 0.1;
                        }
                        
                        // Animate ring particles
                        const particles = planet.mesh.children.find(child => child.type === 'Points');
                        if (particles) {
                            particles.rotation.y += deltaTime * 0.05;
                        }
                    }
                    
                    if (planetName === 'earth') {
                        // Rotate Earth's moon
                        const moon = planet.mesh.children.find(child => child.geometry.type === 'SphereGeometry');
                        if (moon) {
                            moon.rotation.y += deltaTime * 0.5;
                            // Moon orbit
                            const moonAngle = elapsedTime * 0.5;
                            moon.position.x = Math.cos(moonAngle) * planet.data.size * 3;
                            moon.position.z = Math.sin(moonAngle) * planet.data.size * 3;
                        }
                    }
                    
                    if (planetName === 'jupiter') {
                        // Animate Jupiter's Great Red Spot
                        const spot = planet.mesh.children.find(child => child.material && child.material.color.getHex() === 0xFF4444);
                        if (spot) {
                            spot.rotation.y += deltaTime * 0.3;
                            const spotPulse = 1 + Math.sin(elapsedTime * 4) * 0.1;
                            spot.scale.setScalar(spotPulse);
                        }
                    }
                });
                
                // Animate asteroid belt
                asteroidBelt.forEach(asteroid => {
                    asteroid.angle += asteroid.speed * deltaTime;
                    asteroid.mesh.position.x = Math.cos(asteroid.angle) * asteroid.radius;
                    asteroid.mesh.position.z = Math.sin(asteroid.angle) * asteroid.radius;
                    
                    // Rotate asteroids
                    asteroid.mesh.rotation.x += asteroid.rotationSpeed * deltaTime;
                    asteroid.mesh.rotation.y += asteroid.rotationSpeed * deltaTime * 0.7;
                    asteroid.mesh.rotation.z += asteroid.rotationSpeed * deltaTime * 0.5;
                });
                
                // Subtle star movement
                stars.rotation.y += deltaTime * 0.0005;
                stars.rotation.x += deltaTime * 0.0002;
                
                // Animate orbit trails opacity
                Object.values(orbitTrails).forEach((trail, index) => {
                    const opacity = 0.1 + Math.sin(elapsedTime * 0.5 + index) * 0.05;
                    trail.material.opacity = Math.max(0.05, opacity);
                });
            }
            
            renderer.render(scene, camera);
        }

        // Initialize with loading screen
        setTimeout(() => {
            init();
        }, 500);