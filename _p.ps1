Remove-Item -Force -ErrorAction SilentlyContinue '_c.ps1'
& 'C:\Program Files\Git\cmd\git.exe' add -A
& 'C:\Program Files\Git\cmd\git.exe' commit -q -m 'chore: 清理临时脚本' 2>$null
& 'C:\Program Files\Git\cmd\git.exe' push origin main 2>&1 | Select-Object -Last 3
Write-Output '--- log ---'
& 'C:\Program Files\Git\cmd\git.exe' log --oneline -3
Write-Output '--- status ---'
& 'C:\Program Files\Git\cmd\git.exe' status -sb | Select-Object -First 1