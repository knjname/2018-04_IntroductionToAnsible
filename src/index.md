class: center, middle

# 2018/04 Ansible 導入会

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
* Linux は普通程度には知ってる

特に深く掘り下げず、導入をしていきます。

---

class: center, middle

# 我々は何に困っているのか？

---

## サーバの構成という退屈なタスク

* 🐙 「`【本番用】サーバ構築手順書_20180101.docx`どうぞ。」
* 🐶 「了解。」
* 🐶 （一つ一つ TeraTerm 繋げて設定するの面倒だな…）

> 手順 1. SCP で資材をアップロードする。手順 2. Teraterm (TTLogMe) で SSH ログインする。手順 3. `cd /opt/foobar` をする。

…あ、もういいです。お腹いっぱいです。

---

## 間違えるのは誰のせいか？

1. 🐶 「終わったよ」
2. 😿 「頼んでたパッケージとか設定が ホスト XXX に無いんだが…」

* → 一人でやっても複数人でやっても起きうる話
* → 人間が複数ホストをきれいに管理するのは不可能。

---

## 作業ってつまらないし、遅い

* 手順書をそのまま実行できますか？
  * コマンドのコピペ、そして失敗。何がタイプミス？
  * 実施した手順にチェックを押していくんですか？あ、今そこ飛ばさなかった？ちゃんとやった？
  * 手順書がソフトウェアとして動くわけではない。
* 単純に退屈ではありませんか？
  * 何回も定期的に同じ手順を繰り返すの苦痛。
  * ホスト数、何台あると思っている？
    * AP / Batch / DB
  * アプリ数、いくつあると思っている？
  * 環境のバリエーション、いくつあると思っている？
  * サブシステム、いくつあると思っている？

---

## サーバに個性はいらない

* 無駄な個性は、引き継ぎが大変
* アドホックに発生していくサーバ変更
  1. 😸 「あ、 `pstree` が入ってない。入れたろ。」
  2. 😸 「あ、 `iotop` が入ってない。入れたろ。」
  3. 😸 「あ、 `XXXX` が入ってない。epel 追加して入れたろ。」
* 中途半端な作業
  1. 😸 「`/etc/hosts` に今回新しく追加したホストを追加したろ」
  2. 😸 「 サーバ A はこれに影響されるけど、サーバ B は、まあ、…ええやろ 」

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
* 商用サポート版あり

---

## サーバ構成管理ツール

* サーバのあるべき姿を書いた Playbook という YAML を実行することにより、サーバのあるべき姿に導く
  * あるべき姿: firewalld が動いている
  * あるべき姿: apache がインストールされて動いている
  * あるべき姿: chrony がインストールされている
  * あるべき姿: こちらで管理しているファイルが `/etc/xxx/xxx.conf` に入っている

---

## もっと簡単にいえば、すごい SSH

* `ssh` でできることはできる。できないことはできない。
  * 基本的には CLI 操作の自動化しかできない。
    * GUI / インタラクティブ前提は滅びてください

---

## [仲間](https://alternativeto.net/software/ansible/)

* Chef
  * 元祖サーバ構成管理ツールといえばこれ。
  * ここからサーバ構成管理が流行った感がある。
* Puppet
* Salt
  * 日本じゃあまり知られてない。

これ以外にも、クラウドプラットフォームごとプロビジョニングをするツールがあったりしますが、深追いはしません。

---

## Ansible の利点

* サーバ側にエージェントが不要 (エージェントレス)
  * 一番の利点。単純に始めやすい
  * サーバが SSH で入れて、Python が入っていれば OK。
    * Windows でも動きます。
* プログラミング出てこない
  * ほぼ YAML で記述。要するに JSON や XML の仲間みたいなので記述。
    * 凝ったことをやろうとすると、設定ファイルでプログラミングするようなイメージになる。
  * 作り込み方が収束しやすい。反面、自由度はあまりない。
    * とはいえ、他のプログラミング言語を使うケースでも DSL なので似たらしい結果にはなる。
  * ノンプログラマーも懐柔しやすいのでは？
* シンプル
  * 色々な仕組みはあるものの、最終的には上から下に SSH 上で操作をしていくスタイルに近い。
* 人気がある （**一番大事**）

---

## 向き・不向き

### 向いている

* 大量のホストを一括管理したい
  * 特にクラウド環境
* サーバのセットアップをコードとして文書化したい

### 向いていない

* やたら凝ったセットアップが必要なサーバには不向き
  * FB チャネルでネットワークストレージをボリュームに追加して再起動云々みたいな手順は管理できないと思う
* すごい特殊な環境には不向き
* ログインを自動化できない
  * いちいちパスワード入力が必要なケース

---

## 利点を活かすのに大事な視点

* サーバはシンプルな方がいい
* なるべく管理するサーバの特徴（ディストリビューションなど）は均一化されていたほうがいい

現段階では汎用の Linux を自動的に管理するのには向いています。

---

class: center, middle

# Ansible をはじめる

（準備編）

---

## Ansible で使用される言語

下記についての知識があると Ansible をやるのに、不自由しないでしょう。

1. YAML (`*.yml` or `*.yaml`)
   * Ansible の構成ファイル、設定値など全てこの形式が使われます。
   * 木構造のデータを多少の型を交えながら書く Perl 界隈発祥のデータ記法。
   * JSON とほぼ等価だと思えばいいです。 (JSON よりは記述力は上)
   * [http://magazine.rubyist.net/?0009-YAML](http://magazine.rubyist.net/?0009-YAML)
   * Markdown と同じく、処理系でフレーバーが違うと思う
2. [Jinja2](http://jinja.pocoo.org/)
   * Python 用のテンプレートエンジン。 Velocity, ERB, Smarty の仲間みたいなもんです。
   * YAML の中に `"{{ Jinja2 テンプレート }}"` のように記述して使うことが多いです。
   * ループ変数、環境変数、などの記述用
3. ini ファイル
   * Windows とかで使われているやつと大差ない。まあ、雰囲気でわかる。

---

## かんたん YAML マスター

### リテラル

```yaml
string # 文字列
"string" # '文字列' でも可
null # NULL
123,456,789 # 数値。小数も可能。
true # 真偽値: true(on) / false(off)
2018-04-20 # 日付
```

```yaml
|
  複数行の
  文字列も
  書ける（先頭のスペースは必要だが入らない）
```

---

## かんたん YAML マスター

### コレクション

#### リスト

```yaml
# ブロックスタイル
- listItem01
- listItem02
---
# フロースタイル
[listItem01, listItem02]
```

#### マップ

```yaml
mapKey1: mapValue1
mapKey2: mapValue2
---
{ mapKey1: mapValue1, mapKey2: mapValue2 }
```

---

### 複合

```yaml
- mapKey1: mapValue1
  mapKey2: mapValue2
- {mapKey1: mapValue1, mapKey2: mapValue2}
```

```yaml
services:
  nginx:
    image: "nginx"
```

---

### ドキュメント

XML でいえば、複数のルート要素、JSON でいえば、複数の JSON ドキュメントを 1 ファイルに記述する機能。

```yaml
# 以下は3ドキュメント構成。 --- が区切り。
---
- list1
- list2
---
"私は元気です"
---
mapKey1: mapValue2
```

---

### エイリアス定義＆参照

```yaml
- &foobar "さくらんぼー！"
- "（>Д<（ ＊ ） ひ、ひぎぃー！"
- *foobar
# => ["さくらんぼー！", "（>Д<（ ＊ ） ひ、ひぎぃー！", "さくらんぼー！"]
```

---

### YAML の特徴的なところ

* XML/JSON とは違い、１ファイルに複数のドキュメント（≒ 木構造のルート）を含めることができます。
  * ドキュメントそのものはマップ・リスト・リテラルどれでもよい
  * ただ Ansible の範囲では、複数のドキュメントとかは使わない。
* 見やすい
  * XML よりも。（XML はツリー構造じゃなくて `一部を<a>リンク</a>にしたり`　する記法が特別に得意。周辺技術も揃っているのが特徴）
* 書きやすい
  * コメントを許さない JSON よりも。
* 表現力がある
  * いろいろな機能があるらしいですが、把握している人、いる？

---

### YAML を知っておくといいこと

* 割りと色々な場面で使われていて潰しは効く
  * docker-compose / SpringBoot / CloudFormation
* あの日輝いていた XML は死んだ
* 競合するフォーマットに [TOML](https://github.com/toml-lang/toml)
  * ini っぽいやつ
* Ansible を使う上では、結局 Ansible が YAML を読んで何を解釈しているか理解できていたほうがスムーズ。（Ansible がどこを高度に解釈して応用しているかわかる）

---

### [Jinja2](http://jinja.pocoo.org/docs/2.10/templates/)

```yaml
"{% ... %}" # ステートメント
"{{ ... }}" # 式
"{# ... #}" # コメント
```

* いろいろあるけど、だいたい YAML 中や設定のテンプレートファイル中で `{{ variable_name }}` みたいなのしか使わない。
  * `{{ ... }}` という記法がモロに YAML とぶつかるので、Ansible では常に `"{{ ... }}"` のように明示的に文字列リテラルの中に書く。

---

## Ansible のインストール

* Windows はサポートされていない
* [macOS / Linux / 一部の UNIX](http://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)

プラットフォーム独立なインストール方法としては、Python の pip でインストールできます。

```console
$ sudo pip install ansible
```

---

class: center, middle

# Ansible をはじめる

（シンプルスタート編）

---

かなり前置きが長くなってしまいましたが、まずはシンプルに Ansible を使い始めてみましょう。

---

## マシン準備

遊び相手として CentOS \* 2 を用意します。

```console
$ cd examples/simple_start
$ vagrant up
```

上記コマンドで、下記サーバが立ち上がり、 `vagrant` というユーザで公開鍵認証によりログインできるようになります。

1. `webserver`: `192.168.50.2`
2. `dbserver`: `192.168.50.3`

---

## 単純に単発のモジュールを実行させてみる

下記のファイルの設定を確認しましょう。

```
hosts ansible.cfg
```

コマンドを流してみましょう。

```console
# 応答チェック (pingモジュール)
$ ansible -m ping web_server

# コマンドの実行 (commandモジュール)
$ ansible -m command -a "whoami" web_server

# rootに昇格して実行
$ ansible -m command -b -a "whoami" web_server

# yum で何か入れてみる (yumモジュール)
$ ansible -m yum -b -a "name=uuid state=present" web_server
$ ansible -m command -a "uuid" web_server
```

---

## サーバの構成管理をしてみる

下記のファイルの設定を確認しましょう。

```
playbook.yml
```

コマンドを流してみましょう。

```console
$ ansible-playbook playbook.yml
# もう1回!
$ ansible-playbook playbook.yml
```

Web ページが立ち上がっているはずです。

http://192.168.50.2/my_php_app/

---

## シンプル編 まとめ

* Ansible で扱うエンティティ
  * ホスト
  * タスク
  * [モジュール](http://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html), e.g. `yum` とか
  * インベントリ = `hosts`
  * プレイブック = `playbook.yml`
* Ansible 実行をスムーズにするためには...
  * Ansible 用ユーザを用意しておく
  * 公開鍵で入れるようにしておく
  * sudo で昇格できるようにしておく

---

class: center, middle

# Ansible をはじめる

（やや複雑編）

---

## やや複雑編

もう少しややこしい設定のサーバ群を立ち上げてみます。

* ステージング
  * Web \* 1
  * DB \* 1
* 本番
  * Web \* 4
  * DB \* 2

立ち上げは前回と同様 `vagrant up` （8 台なので時間がかかります）

---

## 🐸 の大合唱

複数台のマシンで一気にモジュールを実行してみましょう。

```console
$ ansible -i inventories/staging/hosts -m ping all
$ ansible -i inventories/production/hosts -m ping all
```

---

class: center, middle

# 私の場合

---

## 実際に案件に Ansible 放り込んでます

### 前提

* 基本的にアプリは Docker で構成
* よくある (?) フロント + API サーバ + DB サーバ + バッチ + α みたいな構成

* Docker の設定ファイルとなる `docker-`アプリの

---

class: center, middle

# さいごに

---

## 学びたい人向けへの資源

* [Ansible 実践ガイド](https://www.amazon.co.jp/dp/B01NAH7NAA/)
  * これしか買ってないけど、普通に知りたいことは網羅されているし、内容も満足。

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
