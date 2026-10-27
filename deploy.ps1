# 一键推送到 GitHub 并开启 Pages
# 用法：
#   .\deploy.ps1 -User 你的用户名 -Repo 仓库名
#   .\deploy.ps1 -User 你的用户名 -Repo 仓库名 -Token ghp_xxx   (token 不落盘，只用于本次推送)

param(
  [Parameter(Mandatory=$true)][string]$User,
  [Parameter(Mandatory=$true)][string]$Repo,
  [string]$Token,
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

Set-Location $PSScriptRoot

Write-Host "== 1/4 检查工作区 ==" -ForegroundColor Cyan
$dirty = & $git status --porcelain
if ($dirty) {
  Write-Host "有未提交改动，自动提交..." -ForegroundColor Yellow
  & $git add -A
  & $git commit -q -m "update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
& $git log --oneline -1

Write-Host "== 2/4 配置远端 ==" -ForegroundColor Cyan
$remoteUrl = if ($Token) {
  "https://${User}:${Token}@github.com/$User/$Repo.git"
} else {
  "https://github.com/$User/$Repo.git"
}
& $git remote remove origin 2>$null
& $git remote add origin $remoteUrl
Write-Host "remote: https://github.com/$User/$Repo.git"

Write-Host "== 3/4 推送 ==" -ForegroundColor Cyan
& $git push -u origin $Branch

Write-Host "== 4/4 完成 ==" -ForegroundColor Green
if ($Repo -eq "$User.github.io") {
  Write-Host "网址: https://$User.github.io" -ForegroundColor Green
} else {
  Write-Host "网址: https://$User.github.io/$Repo/" -ForegroundColor Green
  Write-Host "注意: 子路径部署需要把 data/site.json 的 base 改为 '/$Repo' 后重跑 node gen.js" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "最后一步（网页操作，只需一次）："
Write-Host "  打开 https://github.com/$User/$Repo/settings/pages"
Write-Host "  Source 选 Deploy from a branch -> $Branch -> / (root) -> Save"
Write-Host "  等 1 分钟，网址生效"
if ($Token) {
  Write-Host ""
  Write-Host "安全提示: 推送完成后请到 https://github.com/settings/tokens 吊销这个 token" -ForegroundColor Yellow
  & $git remote set-url origin "https://github.com/$User/$Repo.git"
}
