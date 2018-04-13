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
* Linux は普通程度には知ってる。SSH の知識はある。

**特に深く掘り下げず、入り口に立っていくことが目的です。**

---

class: center, middle

# 我々は何に困っているのか？

---

## サーバの構成という退屈なタスク

* 🐙 「`【本番用】サーバ構築手順書_20180101.docx`どうぞ。」
* 🐶 「了解。」
* 🐶 （一つ一つ TeraTerm 繋げて設定するの面倒だな…）

> * 手順 1. SCP で資材をアップロードする。
> * 手順 2. Teraterm (TTLogMe) で SSH ログインする。
> * 手順 3. `cd /opt/foobar` をする。

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

マトリクスで 30 超える数のデプロイが本番環境だけで必要というプロジェクトも多いのでは？

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

いつでも減らせる、いつでも増やせる、いつでも作り直せる

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

## Ansible 沿革

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
* 注意：サーバの知識が要らなくなるわけではない。

---

## もっと簡単にいえば、すごい SSH

* `ssh` でできることはできる。できないことはできない。
  * 基本的には CLI 操作の自動化しかできない。
    * GUI / インタラクティブ前提は滅びてください。

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
  * Windows をマネージしたい場合は、PowerShell / [WinRM](<https://msdn.microsoft.com/ja-jp/library/aa384426(v=vs.85).aspx>) など必要。
* プログラミング出てこない
  * ほぼ YAML で記述。要するに JSON や XML の仲間みたいなので記述。
    * 凝ったことをやろうとすると、設定ファイルでプログラミングするようなイメージになる。
  * 作り込み方が収束しやすい。反面、自由度はあまりない。
    * とはいえ、他のプログラミング言語を使うケースでも DSL なので似たらしい結果にはなる。
  * ノンプログラマーも懐柔しやすいのでは？
* シンプル
  * 色々な仕組みはあるものの、最終的には上から下に SSH 上で操作をしていくスタイルに近い。

---

class: center, middle, large

**一番の利点は<br/>人気があること**

---

## Ansible たぶん 向いている

* 大量のホストを一括管理したい
  * 特にクラウド環境
* サーバのセットアップをコードとして文書化したい

---

## Ansible たぶん 向いていない

* やたら凝ったセットアップが必要なサーバには不向き
  * FB チャネルでネットワークストレージをボリュームに追加して再起動云々みたいな手順は管理できないと思う
  * クラウドで提供される VM みたいな層以上の自動化にしか使えない
* すごい特殊な環境には不向き
* 本番環境がすごいオフライン
* ログインを自動化できない
  * いちいちパスワード入力が必要なケース

---

## 利点を活かすのに大事な視点

* サーバはシンプルな方がいい
* なるべく管理するサーバの特徴（ディストリビューションなど）は均一化されていたほうがいい

現段階では汎用の Linux を自動的に管理するのには向いています。

おそらく Ansible の可能性を引き出せないケースであっても初期セットアップには使えるケースは多いと思います。

```
難易度

初期インフラセットアップのみ
  ＜ 継続的なインフラ管理
  ＜ アプリのリリースごと
  ＜ CI / CD
```

---

class: center, middle

# Ansible をはじめる<br/>（準備編）

---

## Ansible で使用される言語

下記についての知識があると Ansible で不自由しないでしょう。

1. YAML (`*.yml` or `*.yaml`)
   * 木構造のデータを多少のデータ型を交えながら書く Perl 界隈発祥のデータ記法。
   * Ansible の構成ファイル、設定値など全てこの形式が使われます。
   * JSON とほぼ等価だと思えばいいです。 (JSON よりは記述力は上)
   * [いい入門記事があるので](http://magazine.rubyist.net/?0009-YAML)、これを読めば OK。
   * Markdown と同じく、処理系で解釈が多少違う。
2. [Jinja2](http://jinja.pocoo.org/)
   * Python 用のテンプレートエンジン。 Velocity, ERB, Smarty の仲間みたいなもんです。
   * YAML の中に `"{{ variable_name }}"` のように記述して使うことが多いです。
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
  書ける（各行の先頭インデントは必要だが、全てトリムされる）
```

---

## かんたん YAML マスター

### リスト

```yaml
# ブロックスタイル
- listItem01
- listItem02
---
# フロースタイル
[listItem01, listItem02]
```

### マップ

```yaml
# ブロックスタイル
mapKey1: mapValue1
mapKey2: mapValue2
---
# フロースタイル
{ mapKey1: mapValue1, mapKey2: mapValue2 }
```

---

## かんたん YAML マスター

### リストとマップの複合

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

## かんたん YAML マスター

### ドキュメント

ドキュメント ＝ 1 つの YAML ツリーデータ。XML でいえば、ルート要素にあたる。

YAML ではこれを `---` で区切ることにより複数持つことができる。

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

## かんたん YAML マスター

### エイリアス定義＆参照

```yaml
- &foobar "さくらんぼー！"
- "ひ、ひぎぃー！"
- *foobar

# => ["さくらんぼー！", "ひ、ひぎぃー！", "さくらんぼー！"]
```

---

### YAML の特徴的なところ

* XML/JSON とは違い、１ファイルに複数のドキュメント（≒ 木構造のルート）を含めることができます。
  * ドキュメントそのものはマップ・リスト・リテラルどれでもよい
  * ただ Ansible の範囲では、複数のドキュメントとかは使わない。
* 見やすい
  * XML よりも。
    * 余談だけれども、XML はツリー構造じゃなくて一部を `<a>リンク</a>` にしたりする記法が特別に得意。周辺技術も揃っているのもいい。
* 書きやすい
  * JSON なんかはコメントが入れられないのがキツイ。
* 表現力がある
  * いろいろな機能があるらしいですが、把握している人、いる？

---

### YAML を知っておくといいこと

* 割りと色々な場面で使われていて知識として潰しは効く
  * docker-compose / SpringBoot / CloudFormation / Google Cloud Deployment Manager
* 普及率
  * あの日輝いていた XML は死んだ
  * JSON も人が手書きするフォーマットとしては死につつある （私の偏見）
* 最近人気の競合フォーマットとして [TOML](https://github.com/toml-lang/toml) がある
  * ini っぽいやつ

Ansible を使う上では、結局 Ansible が YAML を読んで何を解釈しているか理解できていたほうがスムーズ。（Ansible がどこを高度に解釈して応用しているかわかる）

---

### [Jinja2](http://jinja.pocoo.org/docs/2.10/templates/)

```yaml
"{% ... %}" # ステートメント
"{{ ... }}" # 式
"{# ... #}" # コメント
```

* いろいろあるけど、だいたい YAML 中や設定のテンプレートファイル中で `{{ variable_name }}` みたいなのしか使わない。
  * `{{ ... }}` という記法がモロに YAML とぶつかるので、Ansible では常に `"{{ ... }}"` のように明示的に文字列リテラルの中に書く。
* 僕もあんまり詳しくないけど凝ったことやろうとすると、知る必要が出て来るイメージ。

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

# Ansible をはじめる<br />シンプルスタート編

---

## シンプルスタート

かなり前置きが長くなってしまいましたが、まずはシンプルに Ansible を使い始めてみましょう。

---

## マシン準備

遊び相手として CentOS \* 2 を Vagrant(VirtualBox)で用意します。

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

`playbook.yml` など を確認しましょう。

```yaml
---

# 構成はプレイブックというYAMLファイルに記述していく。
- hosts: all
  become: true
  tasks:
    # Fiwewalld を有効化
    - name: enable firewalld
      systemd:
        name: firewalld
        enabled: yes
        state: started
```

---

## サーバの構成管理をしてみる

プレイブックを流すコマンドを流してみましょう。

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
  * [モジュール](http://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)  
    e.g. `yum` とか
  * インベントリ = `hosts`  
    物理的なサーバホストの記述とグルーピングやらはここに書く
  * プレイブック = `playbook.yml`
* Ansible 実行をスムーズにするためには...
  * Ansible 用ユーザを用意しておく
  * 公開鍵で入れるようにしておく
  * sudo で昇格できるようにしておく

---

class: center, middle

# Ansible をはじめる<br />（やや複雑編）

---

## 🐸 やや複雑編

もう少し多いサーバ群を構成してみます。

* ステージング (stg)
  * Web \* 1
  * DB \* 1
* 本番 (prd)
  * Web \* 4
  * DB \* 2

立ち上げは前回と同様に行います。 （8 台なので時間がかかります）

```console
$ cd examples/complicated_start
$ vagrant up
```

---

## 🐸 大合唱

複数台のマシンで一気にモジュールを実行してみましょう。

```console
# ステージング 2台 に一気に実行
$ ansible -i inventories/staging/hosts -m ping all

# 本番 6台 に一気に実行
$ ansible -i inventories/production/hosts -m ping all
```

---

## 🐸 環境ごとのプレイブック反映

環境ごとにプレイブックを反映させていきましょう。

（通常は結合 → ステージング → 本番の順に構成の適用が問題ないか試験しつつスライドすることになります。）

```console
# ステージング 2台
$ ansible-playbook -i inventories/staging/hosts site.yml

# 本番 6台 に一気に実行
$ ansible-playbook -i inventories/production/hosts site.yml
```

---

## グループ、ロールで管理する

1. 物理ホストをグループにわける
2. グループごとに、どんな役割(ロール)を持っているか、設計する
3. グループにロールをアサインする

---

## 今回触れなかったトピック

* 冪等性
  * Ansible 実行ごとに
* ハンドラ
  * 設定ファイルが変更された時にデーモンを再起動（もしくはリロード）するといった制御が可能になります

---

class: center, middle

# 私と Ansible

---

## 実際に案件に Ansible 放り込んでます (2018/01〜)

* 基本的にアプリは Docker + docker-compose で構成。
  * DB などミドルウェア含めてほぼ全て Docker で動く。
  * 全サーバで Docker / docker-compose を使えるように構成。
  * トラブルシューティング、性能監視系、バックアップ系で必要なツールやパッケージも全サーバにインストール。
* よくある (?) フロント + API サーバ + DB サーバ + バッチ + α みたいな構成
  * それぞれの単位で `/opt/foobar/<コンポーネント名>` というパスのディレクトリの下に資材やデータを置いて管理している
    * Ansible でそれぞれロールごとに独立してインストールできるようにルールを作った
* どういう構成になっているのかドキュメントがわりになる。

---

## 開発環境サーバも Ansible で構成しています

* GCP で VM たててその上に前述と同じような形で Ansible セットアップ。
* 下記のサービスを構築してある。（それぞれに専用サブドメインをふってある）
  * LDAP
  * Jenkins
  * Gitlab
  * Subversion
  * Rocket.Chat
  * Redmine
  * Nexus
* 全部 Let's encrypt で取得した証明書で HTTPS(HTTP2.0)でセキュアにアクセス可能にした
  * Let's encrypt の証明書取得はローカルで、アップロードと有効化は Ansible で。
* 他案件にも流用可能かな

---

## 出会い始めのころの思い出

* 適当にプレイブックを作って管理がつらくなって何度か爆死した
  * [Ansible ベストプラクティス](http://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html) に沿えば大丈夫
    * ただディレクトリはたくさんできる。
    * YAML もようけ増える。仕方なし。。。
    * 値系は別 YAML に隔離するとよい。
  * ロールは細かくわけよう

---

class: center, middle

# さいごに

---

## まとめ

* Ansible はシンプルでわかりやすい
* エージェントレスなので始める際の障壁が少ない
* 身近なところから始めたらどうだろうか？
  * 開発環境
  * 本番サーバの初期セットアップ

---

## 学びたい人向けへの資源

[Ansible 実践ガイド](https://www.amazon.co.jp/dp/B01NAH7NAA/)

普通に知りたいことは網羅されている。これさえあれば大丈夫。

---

## 資料はこちら

* ソースコード、資料  
  https://github.com/knjname/2018-04_IntroductionToAnsible
* スライド  
  https://knjname.github.io/2018-04_IntroductionToAnsible/

---

class: center, middle

おわり
