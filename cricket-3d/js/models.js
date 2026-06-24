/**
 * 3D Models Module
 * Creates realistic cricket stadium, players, and equipment
 */

class ModelFactory {
    static createStadium(scene) {
        const stadiumGroup = new THREE.Group();

        // Ground
        const groundGeo = new THREE.PlaneGeometry(200, 200);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1a4d1a,
            roughness: 0.8,
            metalness: 0.0
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.position.y = 0;
        stadiumGroup.add(ground);

        // Cricket Pitch
        const pitchGeo = new THREE.BoxGeometry(3.66, 0.1, 22);
        const pitchMat = new THREE.MeshStandardMaterial({
            color: 0x0d3d0d,
            roughness: 0.9,
            metalness: 0.0
        });
        const pitch = new THREE.Mesh(pitchGeo, pitchMat);
        pitch.position.y = 0.05;
        pitch.castShadow = true;
        pitch.receiveShadow = true;
        stadiumGroup.add(pitch);

        // Crease lines (white markings)
        const creaseGeo = new THREE.BoxGeometry(3.66, 0.01, 0.2);
        const creaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        // Bowling crease
        const bowlingCrease = new THREE.Mesh(creaseGeo, creaseMat);
        bowlingCrease.position.set(0, 0.08, -0.5);
        stadiumGroup.add(bowlingCrease);

        // Popping crease
        const poppingCrease = new THREE.Mesh(creaseGeo, creaseMat);
        poppingCrease.position.set(0, 0.08, 0.5);
        stadiumGroup.add(poppingCrease);

        // Return crease
        const returnCreazeGeo = new THREE.BoxGeometry(0.2, 0.01, 2);
        const returnCrease = new THREE.Mesh(returnCreazeGeo, creaseMat);
        returnCrease.position.set(1.83, 0.08, 0);
        stadiumGroup.add(returnCrease);

        const returnCrease2 = new THREE.Mesh(returnCreazeGeo, creaseMat);
        returnCrease2.position.set(-1.83, 0.08, 0);
        stadiumGroup.add(returnCrease2);

        // Stumps at both ends
        stadiumGroup.add(ModelFactory.createStumps(0, -11));
        stadiumGroup.add(ModelFactory.createStumps(0, 11));

        // Boundary rope
        stadiumGroup.add(ModelFactory.createBoundary());

        // Sight screens
        stadiumGroup.add(ModelFactory.createSightScreen(0, 25));
        stadiumGroup.add(ModelFactory.createSightScreen(0, -25));

        // Floodlights
        stadiumGroup.add(ModelFactory.createFloodlights());

        // Stands (simplified)
        stadiumGroup.add(ModelFactory.createStands());

        // Advertising boards
        stadiumGroup.add(ModelFactory.createAdvertisingBoards());

        return stadiumGroup;
    }

    static createStumps(x, z) {
        const stumpsGroup = new THREE.Group();

        // Stumps
        const stumpGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.71, 8);
        const stumpMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });

        for (let i = -1; i <= 1; i++) {
            const stump = new THREE.Mesh(stumpGeo, stumpMat);
            stump.position.x = i * 0.35;
            stump.castShadow = true;
            stumpsGroup.add(stump);
        }

        // Bails
        const bailGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6);
        const bailMat = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });

        for (let i = -1; i <= 1; i++) {
            const bail = new THREE.Mesh(bailGeo, bailMat);
            bail.position.x = i * 0.35;
            bail.position.y = 0.36;
            bail.castShadow = true;
            stumpsGroup.add(bail);
        }

        stumpsGroup.position.set(x, 0.35, z);
        return stumpsGroup;
    }

    static createBoundary() {
        const boundaryGroup = new THREE.Group();
        const points = [];
        const radius = 45;

        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius
            ));
        }

        const boundaryCurve = new THREE.CatmullRomCurve3(points);
        const boundaryGeo = new THREE.TubeGeometry(boundaryCurve, 64, 0.05, 4, false);
        const boundaryMat = new THREE.MeshStandardMaterial({ color: 0xff6b35 });
        const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
        boundary.castShadow = true;
        boundary.receiveShadow = true;

        return boundary;
    }

    static createSightScreen(x, z) {
        const screenGroup = new THREE.Group();

        const screenGeo = new THREE.BoxGeometry(8, 4, 0.3);
        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.7
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.castShadow = true;
        screen.receiveShadow = true;
        screenGroup.add(screen);

        // Sight screen frame
        const frameGeo = new THREE.BoxGeometry(8.4, 4.2, 0.1);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = 0.2;
        screenGroup.add(frame);

        screenGroup.position.set(x, 2, z);
        return screenGroup;
    }

    static createFloodlights() {
        const lightsGroup = new THREE.Group();
        const positions = [
            { x: 60, y: 50, z: 60 },
            { x: -60, y: 50, z: 60 },
            { x: 60, y: 50, z: -60 },
            { x: -60, y: 50, z: -60 }
        ];

        positions.forEach(pos => {
            // Pole
            const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, pos.y, 8);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(pos.x, pos.y / 2, pos.z);
            pole.castShadow = true;
            lightsGroup.add(pole);

            // Light fixture
            const fixtureGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
            const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
            fixture.position.set(pos.x, pos.y, pos.z);
            fixture.castShadow = true;
            lightsGroup.add(fixture);
        });

        return lightsGroup;
    }

    static createStands() {
        const standsGroup = new THREE.Group();
        const positions = [
            { x: 50, z: 0, rotation: 0 },
            { x: -50, z: 0, rotation: Math.PI },
            { x: 0, z: 50, rotation: Math.PI / 2 },
            { x: 0, z: -50, rotation: -Math.PI / 2 }
        ];

        positions.forEach(pos => {
            const standGeo = new THREE.BoxGeometry(20, 15, 5);
            const standMat = new THREE.MeshStandardMaterial({
                color: 0x334455,
                roughness: 0.8
            });
            const stand = new THREE.Mesh(standGeo, standMat);
            stand.position.set(pos.x, 7, pos.z);
            stand.castShadow = true;
            stand.receiveShadow = true;
            standsGroup.add(stand);
        });

        return standsGroup;
    }

    static createAdvertisingBoards() {
        const boardsGroup = new THREE.Group();
        const boardPositions = [
            { x: 45, z: 15, rotation: -Math.PI / 2 },
            { x: 45, z: -15, rotation: -Math.PI / 2 },
            { x: -45, z: 15, rotation: Math.PI / 2 },
            { x: -45, z: -15, rotation: Math.PI / 2 },
            { x: 15, z: 45, rotation: 0 },
            { x: -15, z: 45, rotation: 0 }
        ];

        const colors = [0xff0000, 0x0066ff, 0xffb300, 0x00aa00, 0xff6b35, 0xffffff];

        boardPositions.forEach((pos, idx) => {
            const boardGeo = new THREE.BoxGeometry(8, 2, 0.2);
            const boardMat = new THREE.MeshStandardMaterial({
                color: colors[idx],
                roughness: 0.6
            });
            const board = new THREE.Mesh(boardGeo, boardMat);
            board.position.set(pos.x, 2, pos.z);
            board.rotation.y = pos.rotation;
            board.castShadow = true;
            boardsGroup.add(board);
        });

        return boardsGroup;
    }

    /**
     * Create a realistic cricket player
     */
    static createPlayer(teamColor, isBatter = true) {
        const playerGroup = new THREE.Group();

        // Head
        const headGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0xd4a574,
            roughness: 0.4
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.7;
        head.castShadow = true;
        playerGroup.add(head);

        // Helmet
        const helmetGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const helmetMat = new THREE.MeshStandardMaterial({
            color: teamColor,
            roughness: 0.3,
            metalness: 0.4
        });
        const helmet = new THREE.Mesh(helmetGeo, helmetMat);
        helmet.position.y = 1.75;
        playerGroup.add(helmet);

        // Body (jersey)
        const bodyGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.8, 8);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: teamColor,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1.0;
        body.castShadow = true;
        playerGroup.add(body);

        // Pads
        const padGeo = new THREE.BoxGeometry(0.15, 0.6, 0.08);
        const padMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.6
        });

        const leftPad = new THREE.Mesh(padGeo, padMat);
        leftPad.position.set(-0.18, 0.4, 0.05);
        playerGroup.add(leftPad);

        const rightPad = new THREE.Mesh(padGeo, padMat);
        rightPad.position.set(0.18, 0.4, 0.05);
        playerGroup.add(rightPad);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6);
        const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.12, 0.4, 0);
        leftLeg.castShadow = true;
        playerGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.12, 0.4, 0);
        rightLeg.castShadow = true;
        playerGroup.add(rightLeg);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 6);
        const armMat = new THREE.MeshStandardMaterial({ color: 0xd4a574 });

        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.25, 1.1, 0);
        leftArm.castShadow = true;
        playerGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.25, 1.1, 0);
        rightArm.castShadow = true;
        playerGroup.add(rightArm);

        // Bat (if batter)
        if (isBatter) {
            const batGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
            const batMat = new THREE.MeshStandardMaterial({
                color: 0x8b4513,
                roughness: 0.7
            });
            const bat = new THREE.Mesh(batGeo, batMat);
            bat.position.set(0.35, 1.1, -0.3);
            bat.rotation.z = Math.PI / 4;
            bat.castShadow = true;
            playerGroup.add(bat);
        }

        // Gloves
        const gloveGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const gloveMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4
        });

        const leftGlove = new THREE.Mesh(gloveGeo, gloveMat);
        leftGlove.position.set(-0.25, 0.6, 0);
        playerGroup.add(leftGlove);

        const rightGlove = new THREE.Mesh(gloveGeo, gloveMat);
        rightGlove.position.set(0.25, 0.6, 0);
        playerGroup.add(rightGlove);

        playerGroup.castShadow = true;
        playerGroup.receiveShadow = true;

        return playerGroup;
    }

    /**
     * Create cricket ball
     */
    static createBall() {
        const ballGeo = new THREE.SphereGeometry(0.073, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.3,
            metalness: 0.2
        });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.castShadow = true;
        ball.receiveShadow = true;

        // Seam (raised line)
        const seamGeo = new THREE.TorusGeometry(0.073, 0.005, 8, 32);
        const seamMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4
        });
        const seam = new THREE.Mesh(seamGeo, seamMat);
        seam.position.y = 0.001;
        seam.scale.y = 0.5;
        ball.add(seam);

        return ball;
    }

    /**
     * Create stumps visual with wickets intact
     */
    static createWickets() {
        const wicketsGroup = new THREE.Group();

        const stumpGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.71, 6);
        const stumpMat = new THREE.MeshStandardMaterial({
            color: 0xf5deb3,
            roughness: 0.5
        });

        for (let i = -1; i <= 1; i++) {
            const stump = new THREE.Mesh(stumpGeo, stumpMat);
            stump.position.x = i * 0.35;
            stump.castShadow = true;
            wicketsGroup.add(stump);
        }

        // Bails
        const bailGeo = new THREE.BoxGeometry(0.12, 0.04, 0.04);
        const bailMat = new THREE.MeshStandardMaterial({
            color: 0xf5deb3,
            roughness: 0.5
        });

        for (let i = -1; i <= 1; i++) {
            const bail = new THREE.Mesh(bailGeo, bailMat);
            bail.position.set(i * 0.35, 0.36, 0);
            bail.castShadow = true;
            wicketsGroup.add(bail);
        }

        wicketsGroup.castShadow = true;
        return wicketsGroup;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModelFactory;
}
