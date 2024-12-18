---
title: "Meetup2412"
pubDatetime: 2024-12-14
tags:
  - meetup
  
description: 2場線上聚會+1場實體聚會 麻煩使用 https://lu.ma/kalug.tw 來報名

---

# 2024 12月聚會

[![hackmd-github-sync-badge](https://hackmd.io/lpcCZkdhRR-wu-1u3NUMZw/badge)](https://hackmd.io/lpcCZkdhRR-wu-1u3NUMZw)


具體更新詳見 https://lu.ma/kalug.tw

## 12/17地端自建 Kubernetes(K8s)小宇宙
- 線上聚會


### slide: [Kubernetes 地端自建 v.s. GKE，哪個更適合你？ @Devfest Taipei 2024 | PPT](https://www.slideshare.net/slideshow/kubernetes-v-s-gke-devfest-taipei-2024/273727315)


#### CAP
- Consistency
- Availability
- Partition tolerance

#### kubernetes 10 years
- Kubernetes v1.32 (2024/12)

POD - replica
Service - https://kubernetes.io/docs/concepts/services-networking/service/
- ClusterIP
- NodePort
- LoadBalancer
PVC - PV

Kustomize - https://kustomize.io/
Helm - https://helm.sh/

Local k8s distro
- kubeadm
    - cluster-api https://cluster-api.sigs.k8s.io/
- https://www.rancher.com/
- k3s
- kind - https://kind.sigs.k8s.io/

CNI
- Flannel
- Calico
- Cilium

GPU operator = https://github.com/NVIDIA/gpu-operator



地端離線 airgap install 
 
cri-dockerd - https://mirantis.github.io/cri-dockerd/


### swap

預設建議關掉

Kubernetes 1.28: Beta support for using swap on Linux
https://kubernetes.io/blog/2023/08/24/swap-linux-beta/


### CRI
- dockerd-cri
- cri-o
- containerd
- crictl
    - https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/


### Netman
https://drive.google.com/file/d/1JnBymxdgXBrRZycvWtOszkl04Gony7n0/view?fbclid=IwZXh0bgNhZW0CMTAAAR2RmfiCzBxlKNjXpu1l8zsuUJF4BAwwI6oqiJgxcbSa4RtfgnPGdadxAWw_aem_jUl1_c8KmdJ6vCh2dFr8LQ

----



## 12/19 kanru (新酷音開發者) 的新酷音&Rust
- 線上聚會

## 12/28 和 Netman 一起聊 聊 tech & 國際友善 / Let's Hack with global friends
- 實體聚會