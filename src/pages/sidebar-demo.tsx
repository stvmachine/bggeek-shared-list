import { Box, Flex, VStack, Text, Button, useBreakpointValue } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import ImprovedSearchSidebar from "../components/ImprovedSearchSidebar";
import { ICollection } from "../utils/types";

const SidebarDemoContent = () => {
  const [members, setMembers] = useState<string[]>(["stevmachine", "Aldie"]);
  const [collections, setCollections] = useState<ICollection[]>([
    { totalitems: 150, pubdate: "2024-01-01" },
    { totalitems: 200, pubdate: "2024-01-02" }
  ]);

  // Responsive breakpoint
  const isMobile = useBreakpointValue({ base: true, md: false });

  const methods = useForm({
    defaultValues: {
      keyword: "",
      numberOfPlayers: "",
      playingTime: "",
      groupBy: "none",
      orderBy: "name_asc",
      members: {
        stevmachine: true,
        Aldie: false
      }
    }
  });

  const handleSearch = (usernames: string[]) => {
    console.log("Search triggered for:", usernames);
  };

  const handleValidatedUsernames = (usernames: string[]) => {
    setMembers(usernames);
    console.log("Validated usernames:", usernames);
  };

  const handleValidationError = () => {
    console.log("Validation error occurred");
  };

  const handleRemoveMember = (member: string) => {
    setMembers(prev => prev.filter(m => m !== member));
    console.log("Removed member:", member);
  };

  const handleRemoveAllMembers = () => {
    setMembers([]);
    console.log("Removed all members");
  };

  return (
    <Box minHeight="100vh" bg="gray.50">
      <Flex height="100vh">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box width="340px" bg="white" borderRight="1px solid" borderColor="gray.200">
            <FormProvider {...methods}>
              <ImprovedSearchSidebar
                members={members}
                collections={collections}
                onSearch={handleSearch}
                onValidatedUsernames={handleValidatedUsernames}
                onValidationError={handleValidationError}
                removeMember={handleRemoveMember}
                removeAllMembers={handleRemoveAllMembers}
              />
            </FormProvider>
          </Box>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <FormProvider {...methods}>
            <ImprovedSearchSidebar
              members={members}
              collections={collections}
              onSearch={handleSearch}
              onValidatedUsernames={handleValidatedUsernames}
              onValidationError={handleValidationError}
              removeMember={handleRemoveMember}
              removeAllMembers={handleRemoveAllMembers}
            />
          </FormProvider>
        )}

        {/* Main Content */}
        <Box flex="1" p={8}>
          <VStack align="start" gap={6}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                Improved Sidebar Demo
              </Text>
              <Text color="gray.600">
                This demo showcases the enhanced sidebar with modern design and improved UX.
                {isMobile && " On mobile, the sidebar appears as a drawer with a floating filter button."}
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" width="100%">
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Key Improvements:
              </Text>
              <VStack align="start" gap={3}>
                <Text>✨ <strong>Collapsible Sections:</strong> Filters and collectors can be collapsed</Text>
                <Text>🎨 <strong>Modern Design:</strong> Rounded corners, better spacing, hover effects</Text>
                <Text>🔍 <strong>Enhanced Search:</strong> Better input styling with icons</Text>
                <Text>👥 <strong>Improved Member Management:</strong> Better visual feedback and interactions</Text>
                <Text>⚡ <strong>Quick Actions:</strong> Clear filters, refresh functionality</Text>
                <Text>📱 <strong>Responsive:</strong> Works well on different screen sizes</Text>
                <Text>🎯 <strong>Mobile Drawer:</strong> Floating filter button opens drawer on mobile</Text>
              </VStack>
            </Box>

            <Box bg="blue.50" p={6} borderRadius="xl" width="100%">
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.800">
                Current State:
              </Text>
              <VStack align="start" gap={2}>
                <Text><strong>Members:</strong> {members.join(", ") || "None"}</Text>
                <Text><strong>Collections:</strong> {collections.length} loaded</Text>
                <Text><strong>Total Games:</strong> {collections.reduce((sum, col) => sum + (col.totalitems || 0), 0)}</Text>
              </VStack>
            </Box>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => window.location.href = "/collection"}
            >
              View Full Collection
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

const SidebarDemo = () => {
  return <SidebarDemoContent />;
};

export default SidebarDemo;
