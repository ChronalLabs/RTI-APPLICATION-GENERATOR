$port = 5000
$tcp = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($tcp) {
    echo "Found process on port $port"
    foreach ($conn in $tcp) {
        $pid_to_kill = $conn.OwningProcess
        if ($pid_to_kill -ne 0) {
            echo "Killing PID: $pid_to_kill"
            Stop-Process -Id $pid_to_kill -Force -ErrorAction SilentlyContinue
        }
    }
    echo "Port $port cleared."
} else {
    echo "No process found on port $port."
}
