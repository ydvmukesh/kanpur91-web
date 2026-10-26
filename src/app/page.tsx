import HomePage from "./(tabs)/home/page";
import TabsLayout from "./(tabs)/layout";

export default function RootPage() {
  return (
    <TabsLayout>
      <HomePage />
    </TabsLayout>
  );
}
