# -*- coding: utf-8 -*-
"""切换部署路径：根路径（用户站）或子路径（项目站）。用法：py tools/set_base.py /pcb-course"""
import json, pathlib, sys, subprocess

base = sys.argv[1] if len(sys.argv) > 1 else ""
p = pathlib.Path(__file__).resolve().parent.parent / "data" / "site.json"
d = json.loads(p.read_text(encoding="utf-8"))
d["base"] = "" if base in ("", "/") else "/" + base.strip("/")
p.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
print("base =", repr(d["base"]))

root = p.parent.parent
subprocess.run(["node", "gen.js"], cwd=root, check=True)
subprocess.run(["node", "tools/check.js"], cwd=root, check=True)
