import { Action, Icon, LaunchType } from "@raycast/api";
import GetCommand from "../get";

export default function ViewCodeAction(props: {slug: string}){
    return (
        <Action.Push 
            title="View This ShareMyCode"
            icon={Icon.Eye}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            target={<GetCommand arguments={{ slug: props.slug }} launchType={LaunchType.UserInitiated}  />}
        />
    );
}