// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 返回顶部按钮
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 移动端菜单
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 轮播图功能
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;
let interval;

// 初始化轮播图
function initCarousel() {
    if (items.length > 0) {
        // 显示第一张图片
        showItem(currentIndex);
        
        // 设置自动播放
        startAutoplay();
        
        // 添加触摸事件支持
        addTouchSupport();
    }
}

// 显示指定索引的图片
function showItem(index) {
    // 隐藏所有图片
    items.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active');
    });
    
    // 显示当前索引的图片
    items[index].style.display = 'block';
    items[index].classList.add('active');
    
    // 更新当前索引
    currentIndex = index;
}

// 下一张图片
function nextItem() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) {
        nextIndex = 0;
    }
    showItem(nextIndex);
}

// 上一张图片
function prevItem() {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = items.length - 1;
    }
    showItem(prevIndex);
}

// 开始自动播放
function startAutoplay() {
    interval = setInterval(nextItem, 5000); // 每5秒切换一次
}

// 停止自动播放
function stopAutoplay() {
    clearInterval(interval);
}

// 添加触摸支持
function addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, false);
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX && touchStartX - touchEndX > 50) {
            // 向左滑动，显示下一张
            nextItem();
        } else if (touchEndX > touchStartX && touchEndX - touchStartX > 50) {
            // 向右滑动，显示上一张
            prevItem();
        }
    }
}

// 初始化轮播图
document.addEventListener('DOMContentLoaded', initCarousel);

// 复制优惠码功能
const copyButtons = document.querySelectorAll('.copy-code');
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const code = button.textContent.split(': ')[1];
        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.textContent;
            button.textContent = '已复制！';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    });
});

// 滚动动画
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 为需要动画的元素添加观察
document.querySelectorAll('.offer-card, .carousel-item, .qr-code').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// 图片懒加载
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// PDF预览控制
document.addEventListener('DOMContentLoaded', () => {
    const pdfObject = document.getElementById('pdf-iframe');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // 隐藏PDF查看器的控制框和图标
    if (pdfObject) {
        // 添加参数到PDF URL以隐藏工具栏
        const pdfUrl = pdfObject.getAttribute('data');
        if (pdfUrl && !pdfUrl.includes('#')) {
            pdfObject.setAttribute('data', pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0');
        }
        
        // 添加PDF加载错误处理
        pdfObject.onerror = function() {
            const pdfPreview = document.getElementById('pdf-preview');
            pdfPreview.innerHTML = `
                <div class="no-pdf-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>PDF加载失败，请检查文件路径是否正确</p>
                </div>
            `;
        };
        
        // 添加PDF加载成功处理
        pdfObject.onload = function() {
            console.log('PDF加载成功');
            
            // 尝试隐藏PDF查看器的工具栏
            try {
                // 如果PDF对象加载完成，尝试隐藏工具栏
                if (pdfObject.contentDocument) {
                    const style = pdfObject.contentDocument.createElement('style');
                    style.textContent = `
                        #toolbarViewerLeft, #toolbarViewerRight, #toolbarViewerMiddle, 
                        #secondaryToolbarButtonContainer, #viewerContainer > div:first-child,
                        #viewerContainer > div:last-child {
                            display: none !important;
                        }
                    `;
                    pdfObject.contentDocument.head.appendChild(style);
                }
            } catch (e) {
                console.error('无法修改PDF查看器样式:', e);
            }
        };
    }
    
    if (prevPageBtn && nextPageBtn && pdfObject) {
        // 上一页按钮点击事件
        prevPageBtn.addEventListener('click', function() {
            try {
                // 尝试使用PDF.js或其他PDF库来实现翻页功能
                // 这里只是一个简单的示例，实际实现可能需要更复杂的逻辑
                console.log('上一页');
                // 如果PDF.js可用，可以使用类似下面的代码
                // if (pdfViewer && pdfViewer.page > 1) {
                //     pdfViewer.page--;
                // }
            } catch (error) {
                console.error('翻页失败:', error);
            }
        });
        
        // 下一页按钮点击事件
        nextPageBtn.addEventListener('click', function() {
            try {
                // 尝试使用PDF.js或其他PDF库来实现翻页功能
                // 这里只是一个简单的示例，实际实现可能需要更复杂的逻辑
                console.log('下一页');
                // 如果PDF.js可用，可以使用类似下面的代码
                // if (pdfViewer && pdfViewer.page < pdfViewer.pageCount) {
                //     pdfViewer.page++;
                // }
            } catch (error) {
                console.error('翻页失败:', error);
            }
        });
    }
});

// 滚动到指定区域
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // 关闭移动端菜单
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });
});

// 移动端菜单切换
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// 图片展示功能
document.addEventListener('DOMContentLoaded', function() {
    const galleryPages = document.querySelectorAll('.gallery-page');
    const pageDots = document.querySelectorAll('.page-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 由于现在只有一页图片，隐藏翻页按钮和指示器
    if (galleryPages.length <= 1) {
        const galleryControls = document.querySelector('.gallery-controls');
        if (galleryControls) {
            galleryControls.style.display = 'none';
        }
    } else {
        let currentPage = 0;

        // 显示指定页面
        function showPage(pageIndex) {
            galleryPages.forEach(page => page.classList.remove('active'));
            pageDots.forEach(dot => dot.classList.remove('active'));
            
            galleryPages[pageIndex].classList.add('active');
            pageDots[pageIndex].classList.add('active');
            currentPage = pageIndex;
        }

        // 下一页
        function nextPage() {
            let nextIndex = currentPage + 1;
            if (nextIndex >= galleryPages.length) {
                nextIndex = 0;
            }
            showPage(nextIndex);
        }

        // 上一页
        function prevPage() {
            let prevIndex = currentPage - 1;
            if (prevIndex < 0) {
                prevIndex = galleryPages.length - 1;
            }
            showPage(prevIndex);
        }

        // 添加事件监听器
        pageDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showPage(index));
        });

        prevBtn.addEventListener('click', prevPage);
        nextBtn.addEventListener('click', nextPage);

        // 自动播放
        let autoplayInterval = setInterval(nextPage, 5000);

        // 鼠标悬停时暂停自动播放
        const galleryContainer = document.querySelector('.image-gallery');
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        galleryContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextPage, 5000);
        });

        // 初始化显示第一页
        showPage(0);
    }
}); 