# pip install dronekit requests


from dronekit import connect, VehicleMode
import time, requests

SERVER = "https://drone-http-server.onrender.com/"

print("Connecting to Pixhawk...")
vehicle = connect('/dev/ttyACM0', baud=57600, wait_ready=True)

def arm_drone():
    print("Arming motors...")
    while not vehicle.is_armable:
        time.sleep(1)

    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        print("Waiting for arming...")
        time.sleep(1)
    print("Drone armed!")

def disarm_drone():
    print("Disarming motors...")
    vehicle.armed = False
    while vehicle.armed:
        time.sleep(1)
    print("Drone disarmed!")

while True:
    try:
        cmd = requests.get(f"{SERVER}/get_command", timeout=5).json()
        action = cmd.get("action")

        if action == "ARM":
            arm_drone()
        elif action == "DISARM":
            disarm_drone()
    except Exception as e:
        print("Net error:", e)

    time.sleep(2)
