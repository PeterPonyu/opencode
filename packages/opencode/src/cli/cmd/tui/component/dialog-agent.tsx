import { createMemo } from "solid-js"
import { parseModel, useLocal } from "@tui/context/local"
import { useSync } from "@tui/context/sync"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"

export function DialogAgent() {
  const local = useLocal()
  const sync = useSync()
  const dialog = useDialog()

  function configuredModel(agent: ReturnType<typeof local.agent.list>[number]) {
    if (agent.name === local.agent.current()?.name) return local.model.current()
    if (agent.model) return agent.model

    const configuredAgent = sync.data.config.agent?.[agent.name]
    if (configuredAgent?.model) return parseModel(configuredAgent.model)

    if (sync.data.config.model) return parseModel(sync.data.config.model)
  }

  function modelLabel(agent: ReturnType<typeof local.agent.list>[number]) {
    const model = configuredModel(agent)
    if (!model) return agent.native ? "native" : agent.description

    const provider = sync.data.provider.find((item) => item.id === model.providerID)
    const info = provider?.models[model.modelID]
    const providerName = provider?.name ?? model.providerID
    const modelName = info?.name ?? model.modelID
    const variant = agent.variant ? ` · ${agent.variant}` : ""
    return `${providerName} · ${modelName}${variant}`
  }

  const options = createMemo(() =>
    local.agent.list().map((item) => {
      return {
        value: item.name,
        title: item.name,
        description: modelLabel(item),
      }
    }),
  )

  return (
    <DialogSelect
      title="Select agent"
      current={local.agent.current()?.name}
      options={options()}
      onSelect={(option) => {
        local.agent.set(option.value)
        dialog.clear()
      }}
    />
  )
}
