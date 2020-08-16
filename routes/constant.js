const C = {
    err_mes : {
        user : [
            'ユーザー名を入力してください．',
            'ユーザーが見つかりません．ユーザ名を確認してください．'
        ],
        url : [
            '有効なアドレスを入力してください．',
            'コードを見つけられませんでした．URLを確認してください．'
        ],
        upload : [
            'ファイルを選択してください．',
            'ファイル形式が正しいものを選択してください．'
        ],
        repo : 'リポジトリが見つかりません．再度選択してください．',
        branch : 'ブランチが見つかりません．再度選択してください．',
        dir : 'フォルダが見つかりません．再度選択してください．',
        file : 'ファイルが見つかりません．再度選択してください．',
        api : 'githubAPI上限に達したため，しばらく時間を置いてから再度試してください．'
    },
    select_path : {
        'github' : '[id^=LC]'
    },
    explain : {
        'repo' : 'リポジトリを選んでください．',
        'branch' : 'ブランチを選んでください．',
        'contente' : 'ファイルまたはフォルダを選んでください．'
    },
    sample_url : {
        'cpp' : "https://github.com/KoenHan/code_typing_app/blob/master/examples/sample.cpp",
        'py' : "https://github.com/KoenHan/code_typing_app/blob/master/examples/sample.py"
    }
}

module.exports = C;