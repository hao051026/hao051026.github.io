Remove-Item -Force -ErrorAction SilentlyContinue '_z.ps1'
& 'C:\Program Files\Git\cmd\git.exe' add -A 2>$null
& 'C:\Program Files\Git\cmd\git.exe' commit -q -m 'chore: final cleanup' 2>$null
$out = & 'C:\Program Files\Git\cmd\git.exe' push origin main 2>&1
Write-Output ('PUSH EXIT=' + $LASTEXITCODE)
& 'C:\Program Files\Git\cmd\git.exe' status -sb 2>&1 | Select-Object -First 1