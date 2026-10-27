# -*- coding: utf-8 -*-
"""源图 -> WebP。按人工挑选的清单输出，只保留与课程主题匹配的图。"""
import pathlib
from PIL import Image

SRC = pathlib.Path(r"D:\DEEPSEEK\社团\电子社课件\images")
OUT = pathlib.Path(r"D:\DEEPSEEK\社团\xiaoran-site\assets\img")
LESSONS = OUT / "lessons"
GALLERY = OUT / "gallery"
for d in (LESSONS, GALLERY):
    d.mkdir(parents=True, exist_ok=True)
    for old in d.glob("*.webp"):
        old.unlink()

def conv(src_name, dst, max_w, quality):
    src = SRC / src_name
    if not src.exists():
        return None
    im = Image.open(src).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=quality, method=6)
    return dst.stat().st_size, im.size

# 每节课封面（与主题严格对应）
COVERS = {
    1:  "00_cover.jpg",   # 认识 PCB：结构与分类
    2:  "01_cover.jpg",   # 元器件认知：元件盒
    3:  "02_cover.jpg",   # 工具与安全：万用表
    4:  "03_cover.jpg",   # 锡焊原理与直插焊接：烙铁+面包板
    5:  "04_c0.jpg",      # 焊接训练板①：电阻
    6:  "05_c0.jpg",      # 训练板②：烙铁头与贴片
    7:  "06_cover.jpg",   # 圣诞树组装：点亮效果
    8:  "07_c0.jpg",      # 通电调试：万用表测
    9:  "08_c2.jpg",      # EDA 入门：电脑
    10: "09_c0.jpg",      # 原理图设计
    11: "10_c0.jpg",      # 封装与布局
    12: "10_c2.jpg",      # 布线实战
    13: "12_c0.jpg",      # 出图与打样：手托板子
    14: "14_c0.jpg",      # 项目启动与评审：围坐讨论
    15: "13_c2.jpg",      # 制作与调试
    16: "15_cover.jpg",   # 作品展
}

# 作品墙
GALLERY_PICKS = [
    "03_cover.jpg",  # 烙铁与面包板
    "06_cover.jpg",  # 圣诞树点亮
    "04_c2.jpg",     # 焊接台
    "12_c0.jpg",     # 手托 PCB
    "06_c1.jpg",     # 圆形 PCB
    "01_cover.jpg",  # 元件盒
    "13_c0.jpg",     # 工位
    "08_c1.jpg",     # 动手实操
    "15_cover.jpg",  # 作品展示
    "10_c2.jpg",     # 带线 PCB
    "13_c2.jpg",     # 通电测试
    "15_c1.jpg",     # 结课合影
]

total_in = total_out = 0
for i, src_name in sorted(COVERS.items()):
    r = conv(src_name, LESSONS / f"{i:02d}.webp", 720, 76)
    if not r:
        print(f"MISSING lesson {i:02d} <- {src_name}")
        continue
    size, dim = r
    total_in += (SRC / src_name).stat().st_size
    total_out += size
    print(f"lesson {i:02d} {dim[0]}x{dim[1]} -> {size//1024}K  ({src_name})")

for idx, src_name in enumerate(GALLERY_PICKS, 1):
    r = conv(src_name, GALLERY / f"w{idx:02d}.webp", 1000, 74)
    if not r:
        print(f"MISSING gallery {idx:02d} <- {src_name}")
        continue
    size, dim = r
    total_in += (SRC / src_name).stat().st_size
    total_out += size
    print(f"gallery w{idx:02d} {dim[0]}x{dim[1]} -> {size//1024}K  ({src_name})")

# 首屏：焊接工位
r = conv("13_c0.jpg", OUT / "hero.webp", 1400, 78)
if r:
    size, dim = r
    total_in += (SRC / "13_c0.jpg").stat().st_size
    total_out += size
    print(f"hero {dim[0]}x{dim[1]} -> {size//1024}K")

print(f"TOTAL {total_in//1024}K -> {total_out//1024}K")
