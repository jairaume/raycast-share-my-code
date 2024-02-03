import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import flourite, { DetectedLanguage } from 'flourite';
import { useEffect, useState } from "react";
import useStoredRecents from "../hooks/useStoredRecents";
import CreateCodeAction from "./CreateCodeAction";

export default function CodeView(props: {code: {code:string, parsedCode:string}, slug: string, isLoading: boolean}) {
    const { code : {code, parsedCode}, isLoading, slug } = props;

    const [languages, setLanguages] = useState<DetectedLanguage>();

    const { addRecent, checkRecent, deleteRecent } = useStoredRecents();

   useEffect(() => {
        const l = flourite(code, {noUnknown: true});
        setLanguages(l);
    }, [code])

    return (
        isLoading ? 
            <Detail 
                isLoading={true} 
                navigationTitle="Loading..."
            /> 
            : 
            code ? 
                <Detail 
                    markdown={parsedCode}
                    actions={
                        <ActionPanel title={`sharemycode.fr/${slug}`}>
                            <ActionPanel.Section>

                                <Action.CopyToClipboard 
                                    title="Copy Code" 
                                    content={code}
                                    />
                                <Action.OpenInBrowser 
                                    title="Open in Browser" 
                                    url={`https://sharemycode.fr/${slug}`} 
                                    shortcut={{ modifiers: ["cmd"], key: "b" }}
                                    />
                            </ActionPanel.Section>
                            <ActionPanel.Section title="Other">
                                {
                                    checkRecent(slug) ? 
                                    <Action
                                    title="Remove From Recent"
                                    icon={Icon.Minus}
                                    style={Action.Style.Destructive}
                                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                                    onAction={() => {deleteRecent(slug)}}
                                    />
                                    :
                                    <Action
                                    title="Add as Recent"
                                    icon={Icon.Plus}
                                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                                    onAction={() => {addRecent({slug, content: code, date: new Date(), language: languages?.language || "Unknown"})}}
                                    />
                                }
                                <CreateCodeAction slug={slug}/>
                            </ActionPanel.Section>
                        </ActionPanel>
                    }
                    metadata={
                        <Detail.Metadata>
                            <Detail.Metadata.Label title="Slug" text={{value: slug, color: Color.Yellow}} icon={Icon.Lowercase}/>

                            {languages?.language &&
                                <Detail.Metadata.TagList title="Language" >
                                    <Detail.Metadata.TagList.Item 
                                        text={languages?.language || ""}
                                        icon={Icon.Code}
                                        color={Color.Yellow}
                                    />
                                </Detail.Metadata.TagList>
                            }

                            <Detail.Metadata.Label title="Number of lines" text={{value: code.split("\n").length.toString(), color: Color.Yellow}} icon={Icon.Snippets}/>

                            <Detail.Metadata.Separator />

                            <Detail.Metadata.Link 
                                title="Link" 
                                text={`sharemycode.fr/${slug}`} 
                                target={`https://sharemycode.fr/${slug}`}
                            />
                        </Detail.Metadata>
                    }
                    navigationTitle={`sharemycode.fr/${slug}`}
                />
                :
                <List>
                    <List.EmptyView 
                        icon={{source: "smc.svg", tintColor: Color.Red}}
                        title="No code found"
                        description="Please check the slug or hit Enter to create a new ShareMyCode."
                        actions={
                            <ActionPanel>
                                <CreateCodeAction slug={slug}/>
                            </ActionPanel>
                        }
                    />
                </List>
    );
}