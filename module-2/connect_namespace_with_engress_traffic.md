## install packages
    sudo apt update
    sudo apt install iproute2 inetutils-ping iptables tcpdump -y

## Creating bridge adapter
    sudo ip link add br0 type bridge

## Create namespaces 
    sudo ip netns add red
    sudo ip netns add green

## create veth-cable 
    sudo ip link add green-br type veth peer name green-veth
    sudo ip link add red-br type veth peer name red-veth

## connect veth-cable with bridge
    sudo ip link set green-br master br0
    sudo ip link set red-br master br0

## connect veth-cable with namespace
    sudo ip link set  green-veth netns green
    sudo ip link set red-veth netns red


## set all veth to up state with
    sudo ip link set br0 up
    sudo ip link set green-br up 
    sudo ip link set red-br up
    
    sudo ip netns exec red ip link set lo up
    sudo ip netns exec red ip link set red-veth up

    sudo ip netns exec green ip link set lo up
    sudo ip netns exec green ip link set green-veth up


## set ip address for bridge and namespace veth
    sudo ip addr add 192.168.0.1/16 dev br0  
    
    sudo ip netns exec red ip addr add 192.168.0.2/16 dev red-veth
    sudo ip netns exec green ip addr add 192.168.0.3/16 dev green-veth

## add default gateway
    sudo ip netns exec green ip route add default via 192.168.0.1
    sudo ip netns exec red ip route add default via 192.168.0.1


## set nat rules
    sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/16 -j MASQUERADE

## ping google public ip 8.8.8.8 from red, green namespace
    sudo ip netns exec red ping 8.8.8.8
    sudo ip netns exec green ping 8.8.8.8

