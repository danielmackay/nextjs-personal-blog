
var containers = [
  'documents'
  'images'
  'public'
]

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' existing = {
  name: 'mystorage123'
}

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2021-04-01' existing = {
  parent: storageAccount
  name: 'default'
}

resource blobContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = [for container in containers: {
  parent: blobServices
  name: container
  properties: {
    publicAccess: container == 'public' ? 'Blob' : 'None' 
  }
  dependsOn: [
    storageAccount
  ]
}]
