Vue.config.devtools = true;

Vue.component('card', {
    template: `
      <div class="card-wrap"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="openLink"
        ref="card">
        <div class="card"
          :style="cardStyle">
          <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
          <div class="card-info">
            <slot name="header"></slot>
            <slot name="content"></slot>
          </div>
        </div>
      </div>`,
    mounted() {
      this.width = this.$refs.card.offsetWidth;
      this.height = this.$refs.card.offsetHeight;
    },
    props: ['dataImage'],
    data: () => ({
      width: 0,
      height: 0,
      mouseX: 0,
      mouseY: 0,
      mouseLeaveDelay: null
    }),
    computed: {
      mousePX() {
        return this.mouseX / this.width;
      },
      mousePY() {
        return this.mouseY / this.height;
      },
      cardStyle() {
        const rX = this.mousePX * 30;
        const rY = this.mousePY * -30;
        return {
          transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
        };
      },
      cardBgTransform() {
        const tX = this.mousePX * -20; // уменьшено значение для корректировки позиции
        const tY = this.mousePY * -20; // уменьшено значение для корректировки позиции
        return {
          transform: `translateX(${tX}px) translateY(${tY}px)`
        };
      },
      cardBgImage() {
        return {
          backgroundImage: `url(${this.dataImage})`
        };
      }
    },
    methods: {
      handleMouseMove(e) {
        this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
        this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
      },
      handleMouseEnter() {
        clearTimeout(this.mouseLeaveDelay);
      },
      handleMouseLeave() {
        this.mouseLeaveDelay = setTimeout(() => {
          this.mouseX = 0;
          this.mouseY = 0;
        }, 1000);
      },
      openLink() {
        window.open('https://gitflic.ru/project/fukuyamakeiske/captcha-solver', '_blank');
      }
    }
});
  

document.addEventListener('scroll', function() {
    const scrollDown = document.querySelector('.scroll-down');
    if (window.scrollY > 50) {
        scrollDown.style.opacity = '0';
    } else {
        scrollDown.style.opacity = '1';
    }
});


document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
    
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
    
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
  });


//   document.querySelectorAll('.icon').forEach(icon => {
//     icon.addEventListener('mousemove', (e) => {
//         const rect = icon.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;
//         const rotateX = (y - centerY) / 10;
//         const rotateY = (x - centerX) / -10;

//         icon.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     });

//     icon.addEventListener('mouseleave', () => {
//         icon.style.transform = 'rotateX(0) rotateY(0)';
//     });
// });



document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };
    window.addEventListener('mousemove', event => {
        tgX = event.clientX;
        tgY = event.clientY;
    });
    move();
});


const container = document.getElementById('icons-container');

const iconSize = 150; // Размер иконки в пикселях
const logos = [
    { id: 'telegram-logo', url: 'https://t.me/Fukuyama_Keiske', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg', color: 0x00aaff },
    { id: 'gmail-logo', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=bletkppaul1@gmail.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/archive/8/8c/20220204194708%21Gmail_Icon_%282013-2020%29.svg', color: 0xd44638 },
    { id: 'yandex-logo', url: 'https://mail.yandex.ru/#compose?to=verve@is-god.ru', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Yandex_Mail_icon.svg', color: 0xff0000 },
    { id: 'discord-logo', url: 'https://discordapp.com/users/612663115087347713', logoUrl: 'assets/social_icons/Discord_logo.svg', color: 0x7289da }
];

logos.forEach(logo => {
  const container = document.getElementById(logo.id);
  
  // Создание сцены
  const scene = new THREE.Scene();

  // Создание камеры с уменьшенной площадью до квадрата размером с иконку
  const aspect = 1; // Камера будет квадратной
  const cameraSize = 4; // Размер камеры для отображения иконки
  const camera = new THREE.OrthographicCamera(
      -cameraSize * aspect, 
      cameraSize * aspect, 
      cameraSize, 
      -cameraSize, 
      0.1, 
      1000
  );
  camera.position.z = 5;

  // Создание рендера с прозрачным фоном
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(iconSize, iconSize);
  container.appendChild(renderer.domElement);

  // Загрузка текстуры логотипа
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(logo.logoUrl, () => {
      // Поворот текстуры на 90 градусов вправо
      texture.center.set(0.5, 0.5);
      texture.rotation = Math.PI / 2;

      // Создание материалов для цилиндра
      const topBottomMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const sideMaterial = new THREE.MeshBasicMaterial({ color: logo.color }); // Цвет боковой поверхности

      // Создание геометрии цилиндра с уменьшенной высотой
      const radiusTop = 3;
      const radiusBottom = 3;
      const height = 0.6; // Уменьшенная высота цилиндра
      const radialSegments = 32;
      const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);

      // Создание меша с разными материалами для верхней, нижней и боковой поверхности
      const materials = [sideMaterial, topBottomMaterial, topBottomMaterial];
      const logoMesh = new THREE.Mesh(geometry, materials);
      scene.add(logoMesh);

      // Поворот цилиндра так, чтобы основание было направлено к экрану и логотип был не вверх ногами
      logoMesh.rotation.x = Math.PI / 2;

      // Добавление света для эффекта свечения
      const ambientLight = new THREE.AmbientLight(0x404040, 1); // Мягкий белый свет
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // Анимация
      let isAnimating = false;

      function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
          if (isAnimating) {
              logoMesh.rotation.z += 0.01;
          }
          renderer.render(scene, camera);
      }

      // Обработка изменения размера окна
      window.addEventListener('resize', () => {
          const width = iconSize;
          const height = iconSize;

          renderer.setSize(width, height);
          camera.left = -cameraSize * aspect;
          camera.right = cameraSize * aspect;
          camera.top = cameraSize;
          camera.bottom = -cameraSize;
          camera.updateProjectionMatrix();
      });

      // События наведения мыши
      renderer.domElement.addEventListener('mouseenter', () => {
          isAnimating = true;
          new TWEEN.Tween(logoMesh.rotation)
              .to({ z: Math.PI / 8 }, 500)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();
      });

      renderer.domElement.addEventListener('mouseleave', () => {
          new TWEEN.Tween(logoMesh.rotation)
              .to({ x: Math.PI / 2, y: 0, z: 0 }, 500)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onComplete(() => {
                  isAnimating = false;
              })
              .start();
      });

      // Событие нажатия на иконку
      renderer.domElement.addEventListener('click', () => {
          window.open(logo.url, '_blank');
      });

      // Запуск анимации
      animate();
  });
});

const app = new Vue({
  el: '#app'
});

