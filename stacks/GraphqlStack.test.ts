import {it} from 'vitest'
import {Template} from 'aws-cdk-lib/assertions'
import {initProject} from 'sst/project'
import {App, getStack} from 'sst/constructs'
import {GraphqlAPI} from './GraphqlStack'

it('test stack output', async () => {
    await initProject({stage: 'test'})
    const app = new App({stage: 'test', mode: 'deploy'})
    app.stack(GraphqlAPI)

    //@ts-ignore
    const template = Template.fromStack(getStack(GraphqlAPI))

    template.hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 15
    })
})
