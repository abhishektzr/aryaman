/**
 * Three.js Scene Setup
 * Initializes and manages the 3D scene
 */

class GameScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });

        this.setupRenderer();
        this.setupLighting();
        this.setupEnvironment();
        this.createGameObjects();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.background = new THREE.Color(0x87ceeb);
        this.renderer.fog = new THREE.Fog(0x87ceeb, 300, 500);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(100, 100, 100);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.left = -150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.bias = -0.0001;
        this.scene.add(dirLight);

        // Floodlights
        const floodlightPositions = [
            { x: 80, y: 70, z: 80 },
            { x: -80, y: 70, z: 80 },
            { x: 80, y: 70, z: -80 },
            { x: -80, y: 70, z: -80 }
        ];

        floodlightPositions.forEach(pos => {
            const light = new THREE.PointLight(0xffffff, 0.8, 300);
            light.position.set(pos.x, pos.y, pos.z);
            light.castShadow = true;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            this.scene.add(light);
        });
    }

    setupEnvironment() {
        // Sky sphere
        const skyGeo = new THREE.SphereGeometry(400, 32, 32);
        const skyMat = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(300, 300);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1a4d1a,
            roughness: 0.8,
            metalness: 0.0
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.position.y = 0;
        this.scene.add(ground);
    }

    createGameObjects() {
        // Stadium
        this.stadium = ModelFactory.createStadium(this.scene);
        this.scene.add(this.stadium);

        // Players
        this.batter = ModelFactory.createPlayer(0x0066ff, true);
        this.batter.position.set(0, 0, 1);
        this.scene.add(this.batter);

        this.bowler = ModelFactory.createPlayer(0xffdd00, false);
        this.bowler.position.set(0, 0, -10);
        this.scene.add(this.bowler);

        // Fielders
        this.fielders = [];
        const fielderPositions = [
            { x: 20, z: 20 },
            { x: -20, z: 20 },
            { x: 30, z: 0 },
            { x: -30, z: 0 },
            { x: 20, z: -20 },
            { x: -20, z: -20 },
            { x: 10, z: 15 },
            { x: -10, z: 15 },
            { x: 5, z: -5 }
        ];

        fielderPositions.forEach(pos => {
            const fielder = ModelFactory.createPlayer(0xffdd00, false);
            fielder.position.set(pos.x, 0, pos.z);
            fielder.scale.set(0.8, 0.8, 0.8);
            this.scene.add(fielder);
            this.fielders.push(fielder);
        });

        // Wicketkeeper
        this.wicketkeeper = ModelFactory.createPlayer(0xffdd00, false);
        this.wicketkeeper.position.set(0, 0, 1.2);
        this.wicketkeeper.scale.set(0.9, 0.9, 0.9);
        this.scene.add(this.wicketkeeper);

        // Ball
        this.ball = ModelFactory.createBall();
        this.ball.position.set(0, 2, -15);
        this.scene.add(this.ball);

        // Stumps at both ends
        this.stumpsHome = ModelFactory.createWickets();
        this.stumpsHome.position.set(0, 0, 1);
        this.scene.add(this.stumpsHome);

        this.stumpsAway = ModelFactory.createWickets();
        this.stumpsAway.position.set(0, 0, -23);
        this.scene.add(this.stumpsAway);
    }

    update(deltaTime) {
        // Update animations
        if (this.animationController) {
            this.animationController.update(deltaTime);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    getBall() {
        return this.ball;
    }

    setBallPosition(x, y, z) {
        this.ball.position.set(x, y, z);
    }

    setBallRotation(x, y, z) {
        this.ball.rotation.set(x, y, z);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameScene;
}
