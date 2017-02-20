#!groovy

// node-sass, PSG is using SASS_BINARY_PATH but that's not the long-term plan
// see https://hipchat.prod.app.aexp.com/embedded/history/room/3339/2016/12/09?p=1&q=SASS_BINARY_PATH&t=rid-3339#2093f37e-1774-42b2-8634-bc508564cd13
// short term:
final sassEnv = 'SASS_BINARY_PATH=/usr/node/lib/node-sass/vendor/linux-ppc64-48/binding.node'

// PRs
// release+publish

def npmInstall() {
  final sassEnv = 'SASS_BINARY_PATH=/usr/node/lib/node-sass/vendor/linux-ppc64-48/binding.node'

  stage('install') {
    try {
      wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
        withEnv([sassEnv]) {
          sh 'npm install --cache=./.npm'
        }
      }
    } finally {
      sh 'rm -Rf ./.npm'
    }
  }
}

def npmTest() {
  final sassEnv = 'SASS_BINARY_PATH=/usr/node/lib/node-sass/vendor/linux-ppc64-48/binding.node'

  stage('test') {
    withEnv([sassEnv]){
      sh 'npm test'
    }
  }
}

def preRelease() {
  currentBuild.displayName = "${RELEASE_BRANCH}"

  // just for developing
  stage('clone') {
    echo 'checkout!!'
    // remove all files/folders at this level
    // including dot-prefixed
    // http://unix.stackexchange.com/a/77313
    sh 'rm -Rf ./* ./.[!.]*'
    sh 'ls -lah'
    sh "git clone \"ssh://git@stash.aexp.com/~jcros8/parrot.git\" --branch \"${RELEASE_BRANCH}\" ."
  }

  stage('merge with master') {
    sh "git checkout \"${RELEASE_BRANCH}\""
    sh 'git checkout master'
    sh "git merge \"${RELEASE_BRANCH}\""
    // tag
    releaseVersion = sh (
      script: 'echo `node -e "console.log(require(\'./package.json\').version)"`',
      returnStdout: true
    ).trim()
    sh "git tag \"v${releaseVersion}\""
  }
}

def releaseAndPublish() {
  stage('merge with develop') {
    sh 'git checkout develop'
    sh "git merge \"${RELEASE_BRANCH}\""
  }

  stage('publish') {
    // sh './node_modules/.bin/lerna --canary --yes'
    println './node_modules/.bin/lerna --canary --yes'
  }

  stage('push changes upstream') {
    sh 'git push origin master'
    sh 'git push origin develop'
    sh 'git push origin --tags'
    sh "git push origin --delete \"${RELEASE_BRANCH}\""
  }
}

// run the thing
node('node6') {
  if (params.RELEASE_BRANCH != null) {
    preRelease()
  }

  npmInstall()
  npmTest()

  if (params.RELEASE_BRANCH != null) {
    releaseAndPublish()
  }
}
