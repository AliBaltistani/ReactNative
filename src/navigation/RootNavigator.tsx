import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

// Auth
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Customer
import HomeScreen from '../screens/customer/HomeScreen';
import ShopScreen from '../screens/customer/ShopScreen';
import CartScreen from '../screens/customer/CartScreen';
import TrackingScreen from '../screens/customer/TrackingScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';

// Rider
import RiderHomeScreen from '../screens/rider/RiderHomeScreen';

// Seller
import SellerDashboard from '../screens/seller/SellerDashboard';

// Common
import ProfileScreen from '../screens/common/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab Icon Component ──────────────────────────────────────
function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
    return (
        <View style={tabStyles.iconWrap}>
            <Text style={[tabStyles.emoji, focused && tabStyles.emojiFocused]}>{emoji}</Text>
            <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
        </View>
    );
}

const tabStyles = StyleSheet.create({
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 6,
    },
    emoji: {
        fontSize: 22,
        opacity: 0.5,
    },
    emojiFocused: {
        opacity: 1,
        fontSize: 24,
    },
    label: {
        ...Typography.caption,
        color: Colors.slate,
        marginTop: 2,
        fontSize: 10,
    },
    labelFocused: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

// ─── Customer Tab Navigator ─────────────────────────────────
function CustomerTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.ghost,
                    height: 70,
                    paddingBottom: 10,
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Search" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="OrdersTab"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Orders" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

// ─── Rider Tab Navigator ────────────────────────────────────
function RiderTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.dark,
                    borderTopColor: Colors.charcoal,
                    height: 70,
                    paddingBottom: 10,
                    elevation: 12,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="RiderHome"
                component={RiderHomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="RiderOrders"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Orders" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="RiderEarnings"
                component={RiderHomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="💰" label="Earnings" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="RiderProfile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

// ─── Seller Tab Navigator ───────────────────────────────────
function SellerTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.ghost,
                    height: 70,
                    paddingBottom: 10,
                    elevation: 12,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="SellerHome"
                component={SellerDashboard}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" label="Shop" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="SellerOrders"
                component={SellerDashboard}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="📦" label="Orders" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="SellerItems"
                component={SellerDashboard}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Items" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="SellerProfile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

// ─── Root Navigator ─────────────────────────────────────────
export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Onboarding"
            >
                {/* Auth flow */}
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />

                {/* Customer flow */}
                <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
                <Stack.Screen name="Shop" component={ShopScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Tracking" component={TrackingScreen} />
                <Stack.Screen name="ShopList" component={HomeScreen} />

                {/* Rider flow */}
                <Stack.Screen name="RiderTabs" component={RiderTabs} />

                {/* Seller flow */}
                <Stack.Screen name="SellerTabs" component={SellerTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
