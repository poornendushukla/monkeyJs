
# Welcome to Monkeyjs!

A developer-friendly, framework-agnostic, and highly customizable touring library. Monkeyjs is designed to be easy to use, understand, and extend. The aim is to provide complex functionality without compromising readability and maintainability. Whether you're a beginner or an advanced user, this library strives to offer a simple yet powerful solution for guided tours in your applications.

The core library is written in TypeScript with no third-party dependencies. To ensure ease of integration, wrapper components for popular frameworks like React will be provided, allowing users to simply plug and play.

## Features
- **Framework agnostic**: Can be easily integrated into any framework.
- **Customizable**: Provides extensive options to customize the look and behavior of the tour.
- **No dependencies**: Written entirely in TypeScript without third-party dependencies.
- **Ease of use**: Simple API that minimizes the learning curve.

## Installation

To install Monkeyjs, simply use npm, yarn or pnpm:

### Using npm:
 ```shell
 npm install monkeyts
```

### Using pnpm
```shell
pnpm --filter <package_name> add monkeyts
```


### Usage:
```typescript
 const tourInstance = new Tour( tourConfig, themeOverride); 
// init tour
tourInstance.initTour()
// start tour
tourInstance.start()
```

## Documentation
For detailed documentation on API usage and advanced configuration options, visit the documentation page.

## Contributing
We welcome contributions! If you'd like to improve Monkeyjs or add more features, feel free to fork the repo, create a branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/poornendushukla/monkeyJs/blob/main/LICENSE) file for details.





