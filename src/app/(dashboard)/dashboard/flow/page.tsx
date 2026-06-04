import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function FlowPage() {
    return (
        <div className="flex flex-1 border-2 flex-col p-6">
            <div className="flex flex-1 h-full gap-4 border-2 rounded-3xl">
                <div className="flex-1">
                    <ReactFlow>
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}
