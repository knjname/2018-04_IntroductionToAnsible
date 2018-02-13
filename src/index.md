class: center, middle

# 2018/03 Ansible 導入会

by Kenji Saitou

---

# 今日話す内容

サーバの構成管理ツールの Ansible について使い方などを紹介していきます。

---

# 今日ターゲットにする人

* Ansible やったことない人、さわったことない人
* サーバ構成で忘れ物がある人
  * 複数台セットアップで抜け漏れマン 😅
* 自動化大好きマン

---

class: center, middle

# 我々は何に困っているのか？

---

## サーバの構成という退屈なタスク

1. 😸 「これで構築お願いします」<br>つ `【本番用】サーバ構築手順書_20180101.docx`
2. 🐶 「了解。」
3. 🐶 （一つ一つ TeraTerm 繋げて設定するの面倒だな…）

* → そりゃまあそうでしょう

---

## 間違えるのは誰のせいか？

1. 🐶 「終わったよ」
2. 😿 「頼んでたパッケージとか設定が ホスト XXX に無いんだが…」

* → 一人でやっても複数人でやっても起きうる話
* → 人間が複数ホストをきれいに管理するのは不可能。

---

## アドホックに発生していくサーバ変更

1. 😸 「あ、 `pstree` が入ってない。入れたろ。」
2. 😸 「あ、 `iotop` が入ってない。入れたろ。」
3. 😸 「あ、 `XXXX` が入ってない。epel 追加して入れたろ。」

* → どこのホストに何が入っているかもうわかりません

1. 😸 「`/etc/hosts` に今回新しく追加したホストを追加したろ」
2. 😸 「 サーバ A はこれに影響されるけど、サーバ B は、まあ、…ええやろ 」

* → 管理とは一体…

---

## 進むべき方向

### ❌

* 🐶 「きちんと指差し確認をして、作業所にチェック印をして、作業漏れがないようにしよう！！」
* 🐶 「んじゃ、TeraTerm マクロ仕込んだろｗ」

→ 入り口は出口にもなっております。

### 💯

* 🐶 「ホストのあるべき状態をきちんとコードで管理しよう」

→ ようこそ！世界へ！

---

class: center, middle

# Ansible とは何か？

---

## 沿革

* 公式サイト: https://www.ansible.com/
* ソースコード: https://github.com/ansible/ansible
* 開発: RedHat
* Since 2012 年 〜
* エディション
  * [Ansible Engine](https://www.ansible.com/products/engine/pricing)<br>Ansible の有償サポート＋追加機能版。ありていに言えば Pro 版。
  * [Ansible Tower](https://www.ansible.com/products/tower)<br>Ansible の中央管理サーバ（GUI 付き） 。
* 類似プロダクト
  * [Puppet](https://puppet.com/)
  * [Chef](https://www.chef.io/chef/)

---

## 簡単にいえば、すごい SSH

* サーバのあるべき姿を書いた Playbook という YAML を実行することにより、サーバのあるべき姿に導く
  * あるべき姿: firewalld が動いている
  * あるべき姿: apache がインストールされて動いている
  * あるべき姿: chrony がインストールされている
  * あるべき姿: こちらで管理しているファイルが `/etc/xxx/xxx.conf` に入っている

---

## アーキテクチャ

## どう動くのか？

(TODO: 図)

---

## アーキテクチャ

### 簡単にいえば、 SSH + Python

* ものすごく簡単に言うと、すごい SSH
  * SSH でできないことはできない
* Chef のようにエージェントのインストールは不要
  * これは良い
* リモートが下記を満たしていれば管理可能。
  * Linux (or Windows)
  * SSH ログインできる
  * Python がインストールされている → 普通はインストールされてる

---

## 向き・不向き

* 向いている
  * 大量のホストを一括管理したい
    * 特にクラウド環境
  * サーバのセットアップをコードとして文書化したい
* 向いていない
  * やたら凝ったセットアップが必要なサーバには不向き
    * FB チャネルでネットワークストレージをボリュームに追加して再起動云々みたいな手順は管理できないと思う
  * すごい特殊な環境には不向き
  * ログインを自動化できない
    * いちいちパスワード入力が必要なケース

現段階では汎用の Linux を自動的に管理するのには向いています。

---

class: center, middle

# Ansible とは何か？

---

## かんたん YAML マスター

---

## インストール

---

## 学びたい人向けへの資源

私は Web と経験で学びました…が、

* 本
  * [Jenkins 実践入門](https://www.amazon.co.jp/dp/4774189286/)
    * 読んだことないですが、新しい版も出てるし定番っぽい
  * [継続的デリバリー](https://www.amazon.co.jp/dp/4048707876/)
    * デプロイの自動化とは何か？美徳は何か？を教えてくれる
    * 個人的におすすめ
* [Jenkins の資格もあるよ](https://www.cloudbees.com/jenkins/jenkins-certification)

---

class: center, middle

# 私の体験談

---

## 本番環境構築

---

class: center, middle

# さいごに

---

## 資料はこちら

* https://github.com/knjname/2017-07_IntroductionToJenkins
* https://knjname.github.io/2017-07_IntroductionToJenkins/

---

## Q and A

### Q. XXX

A. XXX

---

class: center, middle

おわり
