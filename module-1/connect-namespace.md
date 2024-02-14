## Connect Two name space

### Method 1: Using Bridge

requirements:

```bash
    sudo apt install iproute2 net-tools -y
```

#### create two namespace

```bash
    sudo ip netns add ns1
    sudo ip netns add ns2
    #check
    sudo ip netns list
```

#### create Bridge

```bash
    sudo ip link add br0 type bridge
    #check
    sudo ip a | grep br0
```

#### create two link or cable

```bash
    sudo ip link add veth-br1 type veth peer name veth-ns1  # for ns1
    sudo ip link add veth-br2 type veth peer name veth-ns2  # for ns2
```

#### connect bridge and namespace

```bash
    # connecting ns1 and br0
    sudo ip link set veth-br1 master br0        
    sudo ip link set veth-ns1 netns ns1
    # connecting ns2 and br0
    sudo ip link set veth-br2 master br0
    sudo ip link set veth-ns2 netns ns2
```

#### set all the virtual ethernet adapter(veth) UP

```bash
    #In host up  br0, veth-br1,veth-br2
    sudo ip link set br0 up
    sudo ip link set veth-br1 up
    sudo ip link set veth-br2 up
    # In namespace ns1 set veth adapter lo, veth-ns1
    sudo ip netns exec ns1 ip link set lo up
    sudo ip netns exec ns1 ip link set veth-ns1 up
    # In namespace ns2 up veth adapter lo, veth-ns2
    sudo ip netns exec ns2 ip link set lo up
    sudo ip netns exec ns2 ip link set veth-ns2 up
```

#### set ip and gateway

```bash
    #In host
    sudo ip addr add 192.168.0.1/24 dev br0  # set bridge adapter ip
    #In namespace ns1
    sudo ip netns exec ns1 ip addr add 192.168.0.4/24 dev veth-ns1 # set veth-ns1 adapter ip
    sudo ip netns exec ns1 ip route add default via 192.168.0.1 dev veth-ns1 # veth-ns1 adapter gateway
    #In namespace ns2
    sudo ip netns exec ns2 ip addr add 192.168.0.5/24 dev veth-ns2 # set veth-ns2 adapter ip
    sudo ip netns exec ns2 ip route add default via 192.168.0.1 dev veth-ns2 # vet-ns2 adapter gateway
```

## Test Connection
```bash
    # ping  ns1 and br0
    sudo ip netns exec ns1  ping 192.168.0.1  # ns1 >>>>> br0  ok
    sudo ip netns exec ns1  ping 192.168.0.4  # ns1 >>>>> ns1  ok
    sudo ip netns exec ns1  ping 192.168.0.5  # ns1 >>>>> ns2  ok
    # ping ns1 and b
    sudo ip netns exec ns2  ping 192.168.0.1  # ns1 >>>>> br0  ok
    sudo ip netns exec ns2  ping 192.168.0.4  # ns1 >>>>> ns1  ok
    sudo ip netns exec ns2  ping 192.168.0.5  # ns1 >>>>> ns2  ok
```
### Connect  namespace to internet
```bash
    
    sudo ip netns exec ns2  ping 8.8.8.8 # not responding
    sudo apt install iptables -y
    sudo ip netns exec ns2  ping 8.8.8.8 # unreachable

    sudo sysctl -w net.ipv4.ip_forward=1  # temporary ip forwarding in kernel
    sudo iptables -t nat -A POSTROUTING -j MASQUERADE -s 192.168.0.0/24 ! -o br0
     sudo ip netns exec ns2  ping 8.8.8.8 # response ok working also ping vm
```
### Connect  internet to namespace
```bash
     


    
    sudo nsenter --net=/var/run/netns/ns1 #login to ns1 namespace: 
    python3 -m http.server --bind 192.168.0.4 3000 # Start a server: 

    #If we have real ip we can telnet it: 
    telnet 65.2.35.192 5000
    # But error comes: telnet: Unable to connect to remote host: Connection refused
    #As we can see we can't reach the destination. Because we didn'i tell the Host #machine where to put the incoming traffic. We have to NAT again, this time we will define the destination.

    sudo iptables \
    - t nat \
    - A PREROUTING \
    - d 172.31.13.55 \
    - p tcp -m tcp --dport 5000 \
    - j DNAT --to-destination 192.168.1.10:5000

   # We successfully recieved traffic from internet inside container network 53.
```
