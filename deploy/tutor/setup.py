from setuptools import find_packages, setup

setup(
    name="tutor-cyberlearn",
    version="0.1.0",
    description="Open edX Tutor integration plugin for CyberLearn Kenya and CTFd LTI bridge",
    long_description="Open edX Tutor plugin providing LTI 1.3 Advantage integration, CTFd challenge sidecar container, and automated grade passback.",
    author="CyberLearn Kenya",
    license="MIT",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "tutor>=15.0.0",
    ],
    entry_points={
        "tutor.plugin.v1": [
            "cyberlearn = tutor_cyberlearn.plugin"
        ]
    },
)
