---
title: "DevFest 2024 Kaoshuing - 使用 Keras 深度改造 Gemma (John Lu)"
pubDatetime: 2024-11-23T15:30:00
slug: keras
tags:
  - meetup keras gemma llm
author: john.lu
description: 使用 Keras 深度改造 Gemma
youtube: zzX9TLN8c2A
---

[![hackmd-github-sync-badge](https://hackmd.io/Ty6ng3iQSDivJH3X78r8lQ/badge)](https://hackmd.io/Ty6ng3iQSDivJH3X78r8lQ)

使用 Keras 深度改造 Gemma

這段演講的內容主要介紹如何使用Keras來修改開源的Gemma模型。以下是主要的總結：

Gemma模型概述：

Gemma是Google開源的語言模型（LM），有不同的版本，包括常規版本和經過指令微調（instruction fine-tuned）版本，後者適用於多輪對話。
Gemma模型的架構是基於"decoder-only"的結構，使用多層解碼器、注意力機制（attention）和前饋網絡（feed-forward network）來生成下一個token。
Keras的使用：

Keras支援不同精度的配置，例如在微調時使用混合半精度，而在模型部署時使用完整精度。
Keras還支援兩種並行化技術：數據並行（data parallelism）和模型並行（model parallelism），能夠加速訓練和推理過程。
並行化技術：

通過在多個設備上分配模型和數據，Keras能夠實現模型的並行化。具體來說，可以將數據或模型分割到多個加速器（如TPU）上進行處理，這有助於提高運算效率。
Gemma微調與指令微調：

Gemma的指令微調版本特別適合於問答和對話任務，通過設置合適的prompt模板來達成多輪對話。
微調過程中，可以根據特定的任務對模型進行調整，從而改善其表現。
Context Length擴展：

由於語言模型有最大上下文長度的限制，演講介紹了如何使用最新的技術來擴展模型的上下文長度，使其能處理更長的文本序列。
控制向量（Control Vectors）：

除了常規的prompt工程，還介紹了一種更進階的方法——控制向量。這是一種通過對模型內部表示進行修改，來影響模型輸出行為的方法。這些控制向量根據模型的內部激活值進行調整，可以用來引導模型產生特定的回答方向。
自定義注意力機制：

為了解決長文本的處理問題，介紹了如何通過修改Gemma的注意力機制（例如實現Sliding Window Attention和Self-Extend）來擴展模型處理長上下文的能力。
這些技術和方法的結合使得Gemma模型在多輪對話和長文本處理上具有更強的應用潛力，並能夠進行更加靈活的微調和優化。
