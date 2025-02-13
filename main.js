let scene, camera, renderer, head, controls;

function init() {
    // 创建场景
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5); // 增加光源强度
    // 添加更多光源
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.3);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // 设置固定的相机位置
    camera.position.set(0, 0, 26);
    camera.lookAt(0, 0, 0);

    // 加载 FBX 模型
    const loader = new THREE.FBXLoader();
    loader.load(
        'face.fbx',
        (fbx) => {
            head = fbx;
            head.position.set(0, 0, 0);
            scene.add(head);

            // 加载完成后初始化控制器
            initControls();
            animate();
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('加载模型时出错:', error);
        }
    );
}

function initControls() {
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            // 降低旋转速度系数
            const rotationSpeed = 0.003; // 从 0.01 降低到 0.003

            if (e.shiftKey) {
                // 按住Shift键时控制roll
                head.rotation.z += deltaMove.x * rotationSpeed;
            } else {
                // 正常拖动控制pitch和yaw
                head.rotation.y += deltaMove.x * rotationSpeed;
                head.rotation.x += deltaMove.y * rotationSpeed;
            }

            // 更新输入框
            document.getElementById('pitch').value = (head.rotation.x * 180 / Math.PI).toFixed(1);
            document.getElementById('yaw').value = (head.rotation.y * 180 / Math.PI).toFixed(1);
            document.getElementById('roll').value = (head.rotation.z * 180 / Math.PI).toFixed(1);

            // 更新滑块
            document.getElementById('pitch-slider').value = (head.rotation.x * 180 / Math.PI).toFixed(1);
            document.getElementById('yaw-slider').value = (head.rotation.y * 180 / Math.PI).toFixed(1);
            document.getElementById('roll-slider').value = (head.rotation.z * 180 / Math.PI).toFixed(1);
        }
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 添加输入框事件监听
    document.getElementById('roll').addEventListener('input', updateRotation);
    document.getElementById('pitch').addEventListener('input', updateRotation);
    document.getElementById('yaw').addEventListener('input', updateRotation);

    // 添加滑块事件监听
    document.getElementById('roll-slider').addEventListener('input', (e) => {
        document.getElementById('roll').value = e.target.value;
        updateRotation();
    });
    document.getElementById('pitch-slider').addEventListener('input', (e) => {
        document.getElementById('pitch').value = e.target.value;
        updateRotation();
    });
    document.getElementById('yaw-slider').addEventListener('input', (e) => {
        document.getElementById('yaw').value = e.target.value;
        updateRotation();
    });

    // 添加复制按钮事件
    document.getElementById('copyButton').addEventListener('click', copyParameters);

    // 添加重置按钮事件
    document.getElementById('resetButton').addEventListener('click', resetRotation);
}

function resetRotation() {
    // 重置所有角度为0
    head.rotation.set(0, 0, 0);
    
    // 更新输入框
    document.getElementById('pitch').value = '0.0';
    document.getElementById('yaw').value = '0.0';
    document.getElementById('roll').value = '0.0';
    
    // 更新滑块
    document.getElementById('pitch-slider').value = '0';
    document.getElementById('yaw-slider').value = '0';
    document.getElementById('roll-slider').value = '0';
}

function copyParameters() {
    const roll = document.getElementById('roll').value;
    const pitch = document.getElementById('pitch').value;
    const yaw = document.getElementById('yaw').value;
    
    const text = `Roll: ${roll}°, Pitch: ${pitch}°, Yaw: ${yaw}°`;
    navigator.clipboard.writeText(text).then(() => {
        alert('参数已复制到剪贴板！');
    });
}

function updateRotation() {
    const roll = parseFloat(document.getElementById('roll').value) * Math.PI / 180;
    const pitch = parseFloat(document.getElementById('pitch').value) * Math.PI / 180;
    const yaw = parseFloat(document.getElementById('yaw').value) * Math.PI / 180;

    // 直接设置模型的旋转
    head.rotation.set(pitch, yaw, roll);

    // 更新滑块值
    document.getElementById('roll-slider').value = document.getElementById('roll').value;
    document.getElementById('pitch-slider').value = document.getElementById('pitch').value;
    document.getElementById('yaw-slider').value = document.getElementById('yaw').value;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 窗口大小改变时更新渲染器
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init(); 