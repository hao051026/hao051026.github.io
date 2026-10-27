& 'C:\Program Files\Git\cmd\git.exe' add -A
& 'C:\Program Files\Git\cmd\git.exe' commit -q -m 'chore: 清理' 2>$null
& 'C:\Program Files\Git\cmd\git.exe' push origin main 2>$null | Out-Null
Write-Output ('EXIT=' + $LASTEXITCODE)
& 'C:\Program Files\Git\cmd\git.exe' status -sb | Select-Object -First 1
& 'C:\Program Files\Git\cmd\git.exe' log --oneline -1