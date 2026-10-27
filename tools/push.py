# -*- coding: utf-8 -*-
"""推送站点到 GitHub（token 从环境变量读，不落盘、不进命令行历史）。
用法：
  $env:GH_TOKEN="github_pat_xxx"
  py tools/push.py hao051026 hao051026.github.io
"""
import os, subprocess, sys, pathlib, json, urllib.request

user = sys.argv[1] if len(sys.argv) > 1 else "hao051026"
repo = sys.argv[2] if len(sys.argv) > 2 else f"{user}.github.io"
token = os.environ.get("GH_TOKEN", "")
if not token:
    sys.exit("缺少环境变量 GH_TOKEN")

root = pathlib.Path(__file__).resolve().parent.parent
GIT = r"C:\Program Files\Git\cmd\git.exe"
if not pathlib.Path(GIT).exists():
    GIT = "git"

def run(*args, check=True):
    p = subprocess.run([GIT, *args], cwd=root, capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = (p.stdout or "") + (p.stderr or "")
    if check and p.returncode != 0:
        print(out)
        raise SystemExit(f"git {' '.join(args)} failed")
    return out.strip()

env = {**os.environ, "GIT_TERMINAL_PROMPT": "0"}

print("== 1/4 提交本地改动 ==")
if run("status", "--porcelain", check=False):
    run("add", "-A")
    run("commit", "-q", "-m", "update")
print(run("log", "--oneline", "-1", check=False))

print("== 2/4 设置远端 ==")
url = f"https://{user}:{token}@github.com/{user}/{repo}.git"
run("remote", "remove", "origin", check=False)
run("remote", "add", "origin", url)
print(f"remote: https://github.com/{user}/{repo}.git")

print("== 3/4 推送 ==")
p = subprocess.run([GIT, "push", "-u", "origin", "main"], cwd=root, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
print((p.stdout or "") + (p.stderr or ""))
if p.returncode != 0:
    run("remote", "set-url", "origin", f"https://github.com/{user}/{repo}.git", check=False)
    raise SystemExit("push failed")

# 立刻清掉 remote 里的 token
run("remote", "set-url", "origin", f"https://github.com/{user}/{repo}.git", check=False)
print("已清除 remote 中的 token")

print("== 4/4 开启 GitHub Pages ==")
body = json.dumps({"source": {"branch": "main", "path": "/"}}).encode()
req = urllib.request.Request(
    f"https://api.github.com/repos/{user}/{repo}/pages",
    data=body, method="POST",
    headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json",
             "User-Agent": "dsh", "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        info = json.loads(r.read())
        print("PAGES:", info.get("html_url"), info.get("status"))
except Exception as e:
    print("Pages API:", e)
    print(f"手动开启：https://github.com/{user}/{repo}/settings/pages")

if repo == f"{user}.github.io":
    print(f"\n网址：https://{user}.github.io")
else:
    print(f"\n网址：https://{user}.github.io/{repo}/")
    print("提醒：子路径部署需先跑 py tools/set_base.py " + repo)
