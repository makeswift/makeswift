import * as babel from '@babel/core'
import * as t from '@babel/types'
import template from '@babel/template'
import { NodePath } from '@babel/core'
import MakeswiftError from '../errors/MakeswiftError'

export function manipulateNextConfig(code: string): string {
  function makeswiftNextConfigPlugin() {
    return {
      visitor: {
        Program(path: NodePath<t.Program>) {
          const buildRequire = template(`const IMPORT_NAME = require(SOURCE)()`)
          path.unshiftContainer(
            'body',
            buildRequire({
              IMPORT_NAME: t.identifier('withMakeswift'),
              SOURCE: t.stringLiteral('@makeswift/runtime/next/plugin'),
            }) as t.VariableDeclaration,
          )
        },
        AssignmentExpression(path: NodePath<t.AssignmentExpression>) {
          const { node: leftNode } = path.get('left')

          if (t.isMemberExpression(leftNode)) {
            if (t.isIdentifier(leftNode.object) && t.isIdentifier(leftNode.property)) {
              if (leftNode.object.name === 'module' && leftNode.property.name === 'exports') {
                const moduleExportsValuePath = path.get('right')
                const moduleExportsValueNode = path.node.right

                // Identifier
                if (t.isIdentifier(moduleExportsValueNode)) {
                  moduleExportsValuePath.replaceWith(
                    t.identifier(`withMakeswift(${moduleExportsValueNode.name})`),
                  )
                }

                // Object Expression
                if (t.isObjectExpression(moduleExportsValueNode)) {
                  const newNode = template(`withMakeswift(OBJECT)`)({
                    OBJECT: t.objectExpression(moduleExportsValueNode.properties),
                  }) as t.ExpressionStatement
                  moduleExportsValuePath.replaceWith(newNode)
                }

                // Call Expression
                if (t.isCallExpression(moduleExportsValueNode)) {
                  const newNode = template(`withMakeswift(CALL)`)({
                    CALL: t.callExpression(
                      moduleExportsValueNode.callee,
                      moduleExportsValueNode.arguments,
                    ),
                  }) as t.ExpressionStatement
                  moduleExportsValuePath.replaceWith(newNode)
                }
              }
            }
          }
        },
      },
    }
  }
  const output = babel.transformSync(code, {
    plugins: [makeswiftNextConfigPlugin],
    generatorOpts: {},
  })

  const changedCode = output!.code

  // @todo: make this more robust in the future
  if (changedCode == null || !changedCode.includes('withMakeswift(')) {
    throw new MakeswiftError(
      'Cannot automatically edit your next.config.js.\n\nSee this link on how to do so: https://docs.makeswift.com/guides/manual-installation',
    )
  }

  return changedCode
}

export function isAlreadyIntegrated(code: string): boolean {
  return code.includes('withMakeswift')
}
