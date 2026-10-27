& 'C:\Program Files\Git\cmd\git.exe' add -A 2>$null
& 'C:\Program Files\Git\cmd\git.exe' commit -q -m 'chore: cleanup' 2>$null
& 'C:\Program Files\Git\cmd\git.exe' push origin main 2>$null | Out-Null
Write-Output ('PUSH=' + $LASTEXITCODE)
& 'C:\Program Files\Git\cmd\git.exe' status -sb 2>&1 | Select-Object -First 1
Write-Output '--- 最终 ---'
Get-ChildItem -File | Where-Object { $_.Name -notlike '_*' } | Select-Object -ExpandProperty Name