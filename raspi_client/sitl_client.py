from dronekit import connect, VehicleMode, LocationGlobalRelative
import time, requests

SERVER = "https://drone-http-server.onrender.com"   # your Render URL

print("Connecting to SITL...")
vehicle = connect("tcp:127.0.0.1:5760", wait_ready=True)

def arm_drone():
    while not vehicle.is_armable:
        time.sleep(1)
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True
    while not vehicle.armed:
        time.sleep(1)
    print("Drone armed")

def disarm_drone():
    vehicle.armed = False
    while vehicle.armed:
        time.sleep(1)
    print("Drone disarmed")

def takeoff_drone(alt):
    arm_drone()
    vehicle.simple_takeoff(alt)
    while True:
        current_alt = vehicle.location.global_relative_frame.alt
        print(f"Altitude: {current_alt:.2f}")
        if current_alt >= alt * 0.95:
            print("Reached target altitude")
            break
        time.sleep(1)

def land_drone():
    vehicle.mode = VehicleMode("LAND")
    while vehicle.armed:
        time.sleep(1)
    print("Drone landed")

while True:
    try:
        # Upload telemetry
        telemetry = {
            "altitude": vehicle.location.global_relative_frame.alt,
            "armed": vehicle.armed,
            "mode": vehicle.mode.name
        }
        requests.post(f"{SERVER}/upload", json=telemetry, timeout=15)
        cmd = requests.get(f"{SERVER}/get_command", timeout=15).json()

        action = cmd.get("action")

        if action == "ARM":
            arm_drone()
        elif action == "DISARM":
            disarm_drone()
        elif action == "TAKEOFF":
            takeoff_drone(float(cmd.get("alt", 10)))
        elif action == "LAND":
            land_drone()

    except Exception as e:
        print("Network/Drone error:", e)

    time.sleep(5)

